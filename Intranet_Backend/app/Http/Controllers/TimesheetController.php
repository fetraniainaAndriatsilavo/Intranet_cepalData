<?php

namespace App\Http\Controllers;

use App\Models\Timesheet;
use App\Models\User;
use App\Notifications\TimesheetApproved;
use App\Notifications\TimesheetCreated;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TimesheetController extends Controller
{
    public function getAll()
    {
        $timesheets = Timesheet::with('timesheetPeriod', 'user', 'client', 'project')->get();
        return response()->json($timesheets);
    }

    public function getUserTimesheets($userId)
    {
        $timesheets = Timesheet::with(['client', 'project', 'timesheetPeriod'])
            ->where('user_id', $userId)
            ->get();

        if ($timesheets->isEmpty()) {
            return response()->json([
                'message' => "Aucune feuille de temps trouvée pour cet utilisateur."
            ], 404);
        }

        return response()->json($timesheets);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:intranet_extedim.users,id',
                'date' => 'required|date',
                'nb_hour' => 'required|min:0',
                'client_code' => 'nullable|string',
                'project_id' => 'nullable|integer|exists:intranet_extedim.projects,id',
                'type' => 'nullable|string',
                'description' => 'nullable|string',
                'ts_period_id' => 'required|exists:intranet_extedim.timesheets_periods,id',
                'status' => 'nullable|string',
                'ogc_leave_id' => 'nullable|integer',
                'approved_by' => 'nullable|integer',
                'approved_at' => 'nullable|date',
                'approved_comment' => 'nullable|string',
            ], [
                'user_id.required' => 'L\'utilisateur est requis.',
                'user_id.exists' => 'Utilisateur introuvable.',
                'date.required' => 'La date est obligatoire.',
                'date.date' => 'Format de date invalide.',
                'nb_hour.required' => 'Le nombre d\'heures est requis.',
                'nb_hour.numeric' => 'Les heures doivent être un nombre.',
                'nb_hour.min' => 'Les heures doivent être positives.',
                'ts_period_id.required' => 'La période est requise.',
                'ts_period_id.exists' => 'Période introuvable.',
                'ogc_leave_id.integer' => 'L\'ID de congé doit être un entier.',
            ]);

            if (!empty($validated['ogc_leave_id'])) {
                $exists = DB::table('intranet_extedim.users')
                    ->where('id', $validated['user_id'])
                    ->whereJsonContains('ogc_leave_requests', (int) $validated['ogc_leave_id'])
                    ->exists();

                if (!$exists) {
                    return response()->json([
                        'error' => 'Le congé spécifié ne correspond pas à l\'utilisateur.'
                    ], 422);
                }
            }

            $entryDate = Carbon::parse($validated['date']);
            $warning = null;

            if ($entryDate->isSaturday() || $entryDate->isSunday()) {
                $warning = 'Attention : la date sélectionnée tombe un week-end.';
            }

            $isHoliday = DB::table('intranet_extedim.ogc_holidays')
                ->whereDate('date', $entryDate)
                ->exists();

            if ($isHoliday) {
                $validated['type'] = 'Jour férié';
            } else {
                $hasLeave = DB::table('intranet_extedim.ogc_leave_requests')
                    ->where('user_id', $validated['user_id'])
                    ->whereDate('start_date', '<=', $entryDate)
                    ->whereDate('end_date', '>=', $entryDate)
                    ->exists();

                if ($hasLeave) {
                    $validated['type'] = 'Congé';
                }
            }


            $entry = Timesheet::create($validated);
            $user = User::find($validated['user_id']);

            if ($user && $user->manager_id) {
                $manager = User::find($user->manager_id);
                if ($manager) {
                    $manager->notify(new TimesheetCreated($entry));
                }
            }

            $admins = User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                $admin->notify(new TimesheetCreated($entry));
            }
            return response()->json([
                'data' => $entry,
                'warning' => $warning,
            ], 201);
        } catch (\Throwable $e) {
            Log::error('Erreur lors de la création du timesheet : ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Une erreur interne est survenue.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function approveTimesheet($id)
    {
        $timesheet = Timesheet::with('user')->find($id);

        if (!$timesheet) {
            return response()->json([
                'message' => 'Feuille de temps non trouvée.'
            ], 404);
        }

        $timesheet->status = 'approved';
        $timesheet->approved_at = now();
        $timesheet->save();
        if ($timesheet->user) {
            $timesheet->user->notify(new TimesheetApproved($timesheet));
        }
        return response()->json([
            'message' => 'Feuille de temps approuvée avec succès.',
            'timesheet' => $timesheet
        ], 200);
    }

    public function update(Request $request, int $id)
    {
        $entry = Timesheet::findOrFail($id);

        $validated = $request->validate([
            'date' => 'sometimes|required|date',
            'nb_hour' => 'sometimes|required|min:0',
            'client_code' => 'nullable|string',
            'project_id' => 'nullable|integer',
            'type' => 'nullable|string',
            'description' => 'nullable|string',
            'ts_period_id' => 'nullable|exists:timesheet_periods,id',
            'status' => 'nullable|string',
            'ogc_leave_id' => 'nullable|integer',
            'approved_by' => 'nullable|integer',
            'approved_at' => 'nullable|date',
            'approved_comment' => 'nullable|string',
        ]);

        $entry->update($validated);
        return response()->json($entry);
    }

    public function destroy(int $id)
    {
        $entry = Timesheet::findOrFail($id);
        $entry->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }

    public function getTimesheetById($id)
    {
        try {
            $timesheet = Timesheet::find($id);

            if (!$timesheet) {
                return response()->json([
                    'error' => 'Feuille de temps introuvable'
                ], 404);
            }

            return response()->json($timesheet, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur interne',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
