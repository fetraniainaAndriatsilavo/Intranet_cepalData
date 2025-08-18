<?php

namespace App\Http\Controllers;

use App\Models\Timesheet;
use App\Models\TimesheetPeriod;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PeriodeController extends Controller
{
    public function getSessionById($id)
    {
        try {
            $session = TimesheetPeriod::find($id);

            if (!$session) {
                return response()->json([
                    'error' => 'Session introuvable'
                ], 404);
            }

            return response()->json($session, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur interne',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $messages = [
                'periode.required' => 'Le champ période est obligatoire.',
                'periode.string' => 'Le champ période doit être une chaîne de caractères.',
                'periode.max' => 'Le champ période ne doit pas dépasser 255 caractères.',

                'start_date.date' => 'Le champ date de début doit être une date valide.',
                'end_date.date' => 'Le champ date de fin doit être une date valide.',
                'end_date.after_or_equal' => 'La date de fin doit être postérieure ou égale à la date de début.',
                'status.string' => 'Le champ statut doit être une chaîne de caractères.',
            ];

            $validated = $request->validate([
                'periode' => 'required|string|max:255',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'status' => 'nullable|string',
            ], $messages);

            $TimesheetPeriod = TimesheetPeriod::create($validated);

            return response()->json($TimesheetPeriod, 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur interne',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'updated_by'       => 'required|exists:intranet_extedim.users,id',
            'TimesheetPeriod'  => 'sometimes|string|max:255',
            'start_date'       => 'nullable|date',
            'end_date'         => 'nullable|date|after_or_equal:start_date',
            'status'           => 'nullable|string',
        ], [
            'updated_by.required' => 'Le champ "Mis à jour par" est obligatoire.',
            'updated_by.exists'   => 'L’utilisateur spécifié est introuvable dans la base de données.',

            'TimesheetPeriod.string' => 'La période doit être une chaîne de caractères.',
            'TimesheetPeriod.max'    => 'La période ne peut pas dépasser :max caractères.',

            'start_date.date' => 'La date de début doit être une date valide.',

            'end_date.date'              => 'La date de fin doit être une date valide.',
            'end_date.after_or_equal'    => 'La date de fin doit être postérieure ou égale à la date de début.',

            'status.string' => 'Le statut doit être une chaîne de caractères.',
        ]);


        $timesheetPeriod = TimesheetPeriod::findOrFail($id);

        $oldStatus = $timesheetPeriod->status;

        $timesheetPeriod->update($validated);

        if ($oldStatus !== 'inactive' && $timesheetPeriod->status === 'inactive') {
            $managers = User::where('role', 'manager')->get();

            foreach ($managers as $manager) {
                $manager->notify(new \App\Notifications\TimesheetPeriodClosed());
            }
        }

        return response()->json($timesheetPeriod);
    }

    public function destroy(int $id)
    {
        $timesheetPeriod = TimesheetPeriod::findOrFail($id);
        $timesheetPeriod->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }

    public function getAll()
    {
        $timesheetPeriods = TimesheetPeriod::all();

        return response()->json($timesheetPeriods);
    }

    public function getTimesheetsByPeriod($periodId)
    {
        try {
            $period = TimesheetPeriod::findOrFail($periodId);

            $types = [
                'Congé',
                'Jour férié',
                'Absence',
                'Mise à pied',
                'Repos médical',
                'Convalescence',
                'Assistance maternelle',
                'Tâche',
            ];

            $totals = [];

            $totals['total_hours'] = Timesheet::where('ts_period_id', $periodId)
                ->selectRaw('SUM(EXTRACT(EPOCH FROM nb_hour) / 3600) as total')
                ->value('total') ?? 0;

            foreach ($types as $type) {
                $totals[strtolower(str_replace(' ', '_', $type))] = Timesheet::where('ts_period_id', $periodId)
                    ->where('type', $type)
                    ->selectRaw('SUM(EXTRACT(EPOCH FROM nb_hour) / 3600) as total')
                    ->value('total') ?? 0;
            }

            $timesheets = Timesheet::where('ts_period_id', $periodId)->get();

            return response()->json([
                'timesheet_period' => $period,
                'timesheets' => $timesheets,
                'totals' => $totals
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur interne',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getActiveSessionsWithUsersTotals()
    {
        try {
            $types = [
                'Congé',
                'Jour férié',
                'Absence',
                'Mise à pied',
                'Repos médical',
                'Convalescence',
                'Assistance maternelle',
                'Tâche',
            ];

            $sessions = TimesheetPeriod::where('status', 'active')->get();
            $result = [];

            foreach ($sessions as $session) {
                $userIds = Timesheet::where('ts_period_id', $session->id)
                    ->where('status', 'approved')
                    ->distinct()
                    ->pluck('user_id');

                foreach ($userIds as $userId) {
                    $user = User::find($userId);

                    $query = Timesheet::where('ts_period_id', $session->id)
                        ->where('user_id', $userId)
                        ->where('status', 'approved')
                        ->selectRaw('
                        SUM(EXTRACT(EPOCH FROM nb_hour) / 3600) as total_hours,
                        SUM(CASE WHEN type = ? THEN EXTRACT(EPOCH FROM nb_hour) / 3600 ELSE 0 END) as conge,
                        SUM(CASE WHEN type = ? THEN EXTRACT(EPOCH FROM nb_hour) / 3600 ELSE 0 END) as jour_ferie,
                        SUM(CASE WHEN type = ? THEN EXTRACT(EPOCH FROM nb_hour) / 3600 ELSE 0 END) as absence,
                        SUM(CASE WHEN type = ? THEN EXTRACT(EPOCH FROM nb_hour) / 3600 ELSE 0 END) as mise_a_pied,
                        SUM(CASE WHEN type = ? THEN EXTRACT(EPOCH FROM nb_hour) / 3600 ELSE 0 END) as repos_medical,
                        SUM(CASE WHEN type = ? THEN EXTRACT(EPOCH FROM nb_hour) / 3600 ELSE 0 END) as convalescence,
                        SUM(CASE WHEN type = ? THEN EXTRACT(EPOCH FROM nb_hour) / 3600 ELSE 0 END) as assistance_maternelle,
                        SUM(CASE WHEN type = ? THEN EXTRACT(EPOCH FROM nb_hour) / 3600 ELSE 0 END) as tache
                    ', $types)
                        ->first();

                    $result[] = [
                        'first_name' => $user->first_name ?? '',
                        'department' => $user->department->name ?? '',
                        'session' => $session->periode,
                        'congé' => $query->conge ?? 0,
                        'jour_férié' => $query->jour_ferie ?? 0,
                        'absence' => $query->absence ?? 0,
                        'mise_à_pied' => $query->mise_a_pied ?? 0,
                        'repos_médical' => $query->repos_medical ?? 0,
                        'convalescence' => $query->convalescence ?? 0,
                        'assistance_maternelle' => $query->assistance_maternelle ?? 0,
                        'tâche' => $query->tache ?? 0,
                        'total_hours' => $query->total_hours ?? 0
                    ];
                }
            }

            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur interne',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getActiveSessionsByManager($managerId)
    {
        try {
            $types = [
                'Congé',
                'Jour férié',
                'Absence',
                'Mise à pied',
                'Repos médical',
                'Convalescence',
                'Assistance maternelle',
                'Tâche',
            ];

            $users = User::where('manager_id', $managerId)->get();
            $results = [];

            foreach ($users as $user) {
                $sessions = TimesheetPeriod::where('status', 'active')
                    ->whereIn('id', Timesheet::where('user_id', $user->id)->pluck('ts_period_id'))
                    ->get();

                foreach ($sessions as $session) {
                    $query = Timesheet::where('user_id', $user->id)
                        ->where('ts_period_id', $session->id)
                        ->selectRaw('
                        SUM(EXTRACT(EPOCH FROM nb_hour) / 3600) as total_hours,
                        SUM(CASE WHEN type = ? THEN EXTRACT(EPOCH FROM nb_hour) / 3600 ELSE 0 END) as conge,
                        SUM(CASE WHEN type = ? THEN EXTRACT(EPOCH FROM nb_hour) / 3600 ELSE 0 END) as jour_ferie,
                        SUM(CASE WHEN type = ? THEN EXTRACT(EPOCH FROM nb_hour) / 3600 ELSE 0 END) as absence,
                        SUM(CASE WHEN type = ? THEN EXTRACT(EPOCH FROM nb_hour) / 3600 ELSE 0 END) as mise_a_pied,
                        SUM(CASE WHEN type = ? THEN EXTRACT(EPOCH FROM nb_hour) / 3600 ELSE 0 END) as repos_medical,
                        SUM(CASE WHEN type = ? THEN EXTRACT(EPOCH FROM nb_hour) / 3600 ELSE 0 END) as convalescence,
                        SUM(CASE WHEN type = ? THEN EXTRACT(EPOCH FROM nb_hour) / 3600 ELSE 0 END) as assistance_maternelle,
                        SUM(CASE WHEN type = ? THEN EXTRACT(EPOCH FROM nb_hour) / 3600 ELSE 0 END) as tache
                    ', $types)
                        ->first();

                    $results[] = [
                        'totals' => [
                            'periode' => $session->periode,
                            'nom' => $user->name,
                            'dossier' => $user->client_code ?? null,
                            'presence' => $query->tache ?? 0,
                            'total_hours' => $query->total_hours ?? 0,
                            'congé' => $query->conge ?? 0,
                            'jour_férié' => $query->jour_ferie ?? 0,
                            'absence' => $query->absence ?? 0,
                            'mise_à_pied' => $query->mise_a_pied ?? 0,
                            'repos_médical' => $query->repos_medical ?? 0,
                            'convalescence' => $query->convalescence ?? 0,
                            'assistance_maternelle' => $query->assistance_maternelle ?? 0,
                            'tâche' => $query->tache ?? 0,
                        ]
                    ];
                }
            }

            return response()->json($results, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur interne',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
