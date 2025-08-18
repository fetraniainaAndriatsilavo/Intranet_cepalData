<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\OgCumul;
use App\Models\User;
use App\Models\UserDetails;
use Carbon\Carbon;
use Illuminate\Foundation\Exceptions\Renderer\Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use LeaveRequestStatusNotification;
use Carbon\CarbonPeriod;
use App\Models\OgcHoliday;
use App\Notifications\LeaveRequestCreated;

class LeaveRequestController extends Controller
{

    /**
     * Crée une nouvelle demande de congé/permission/autre
     */
    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'user_id' => 'required|integer|exists:intranet_extedim.users,id',
    //         'reason' => 'nullable|string',
    //         'start_date' => 'required|date',
    //         'end_date' => 'required|date|after_or_equal:start_date',
    //         'start_half_day' => 'required',
    //         'end_half_day' => 'required',
    //         'approved_at' => 'nullable|date',
    //         'approved_by' => 'nullable|integer|exists:intranet_extedim.users,id',
    //         'approved_comment' => 'nullable|string',
    //         'is_inserted_to_ogcumul' => 'nullable|boolean',
    //         'leave_type_id' => 'required|exists:intranet_extedim.ogc_leave_types,id',
    //         'support_file_path' => 'nullable|file|mimes:pdf,jpg,png,docx,doc|max:2048',
    //     ]);

    //     $fileUrl = null;
    //     if ($request->hasFile('support_file_path')) {
    //         $file = $request->file('support_file_path');
    //         $filename = sprintf(
    //             'justificatif_%s.%s',
    //             now()->format('Y-m-d_H-i-s'),
    //             $file->getClientOriginalExtension()
    //         );

    //         $directory = 'users/' . $validated['user_id'] . '/documents';
    //         $disk = Storage::disk('sftp');
    //         if (!$disk->exists($directory)) {
    //             $disk->makeDirectory($directory);
    //         }

    //         $storedPath = $file->storeAs($directory, $filename, 'sftp');

    //         if (!$storedPath) {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'Échec de l\'enregistrement du fichier sur le serveur.',
    //             ], 500);
    //         }

    //         $fileUrl = 'https://57.128.116.184/intranet/' . $storedPath;
    //     }

    //     $start = Carbon::parse($validated['start_date']);
    //     $end = Carbon::parse($validated['end_date']);
    //     $period = CarbonPeriod::create($start, $end);

    //     $holidayDates = OgcHoliday::whereBetween('date', [$start, $end])
    //         ->pluck('date')
    //         ->map(fn($date) => Carbon::parse($date)->format('Y-m-d'))
    //         ->toArray();

    //     $numberDay = collect($period)->filter(function ($date) use ($holidayDates) {
    //         return !$date->isWeekend() && !in_array($date->format('Y-m-d'), $holidayDates);
    //     })->count();

    //     if ($validated['start_half_day'] === 'afternoon') $numberDay -= 0.5;
    //     if ($validated['end_half_day'] === 'morning') $numberDay -= 0.5;

    //     try {
    //         $leaveRequest = LeaveRequest::create([
    //             'user_id' => $validated['user_id'],
    //             'reason' => $validated['reason'] ?? null,
    //             'start_date' => $validated['start_date'],
    //             'end_date' => $validated['end_date'],
    //             'start_half_day' => $validated['start_half_day'],
    //             'end_half_day' => $validated['end_half_day'],
    //             'number_day' => $numberDay,
    //             'status' => 'created',
    //             'approved_at' => $validated['approved_at'] ?? null,
    //             'approved_by' => $validated['approved_by'] ?? null,
    //             'approved_comment' => $validated['approved_comment'] ?? null,
    //             'is_inserted_to_ogcumul' => $validated['is_inserted_to_ogcumul'] ?? false,
    //             'leave_type_id' => $validated['leave_type_id'],
    //             'support_file_path' => $fileUrl,
    //         ]);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Erreur lors de la sauvegarde de la demande de congé.',
    //             'error' => $e->getMessage(),
    //         ], 500);
    //     }

    //     $user = User::find($validated['user_id']);
    //     $recipients = collect();

    //     if ($user && $user->manager_id) {
    //         $manager = User::find($user->manager_id);
    //         if ($manager) $recipients->push($manager);
    //     }

    //     $admins = User::where('role', 'admin')->get();
    //     $recipients = $recipients->merge($admins);

    //     foreach ($recipients as $recipient) {
    //         $recipient->notify(new LeaveRequestCreated($leaveRequest));
    //     }

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Demande de congé enregistrée avec succès.',
    //         'data' => $leaveRequest,
    //     ], 201);
    // }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:intranet_extedim.users,id',
            'reason' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'start_half_day' => 'required',
            'end_half_day' => 'required',
            'approved_at' => 'nullable|date',
            'approved_by' => 'nullable|integer|exists:intranet_extedim.users,id',
            'approved_comment' => 'nullable|string',
            'is_inserted_to_ogcumul' => 'nullable|boolean',
            'leave_type_id' => 'required|exists:intranet_extedim.ogc_leave_types,id',
            'support_file_path' => 'nullable|file|mimes:pdf,jpg,png,docx,doc|max:2048',
        ]);

        $fileUrl = null;
        if ($request->hasFile('support_file_path')) {
            $file = $request->file('support_file_path');
            $filename = sprintf(
                'justificatif_%s.%s',
                now()->format('Y-m-d_H-i-s'),
                $file->getClientOriginalExtension()
            );

            $directory = 'users/' . $validated['user_id'] . '/documents';
            $disk = Storage::disk('sftp');
            if (!$disk->exists($directory)) {
                $disk->makeDirectory($directory);
            }

            $storedPath = $file->storeAs($directory, $filename, 'sftp');

            if (!$storedPath) {
                return response()->json([
                    'success' => false,
                    'message' => 'Échec de l\'enregistrement du fichier sur le serveur.',
                ], 500);
            }

            $fileUrl = 'https://57.128.116.184/intranet/' . $storedPath;
        }

        $start = Carbon::parse($validated['start_date']);
        $end = Carbon::parse($validated['end_date']);
        $period = CarbonPeriod::create($start, $end);

        $numberDay = collect($period)->filter(function ($date) {
            return !$date->isWeekend();
        })->count();

        if ($validated['start_half_day'] === 'afternoon') $numberDay -= 0.5;
        if ($validated['end_half_day'] === 'morning') $numberDay -= 0.5;

        try {
            $leaveRequest = LeaveRequest::create([
                'user_id' => $validated['user_id'],
                'reason' => $validated['reason'] ?? null,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'start_half_day' => $validated['start_half_day'],
                'end_half_day' => $validated['end_half_day'],
                'number_day' => $numberDay,
                'status' => 'created',
                'approved_at' => $validated['approved_at'] ?? null,
                'approved_by' => $validated['approved_by'] ?? null,
                'approved_comment' => $validated['approved_comment'] ?? null,
                'is_inserted_to_ogcumul' => $validated['is_inserted_to_ogcumul'] ?? false,
                'leave_type_id' => $validated['leave_type_id'],
                'support_file_path' => $fileUrl,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la sauvegarde de la demande de congé.',
                'error' => $e->getMessage(),
            ], 500);
        }

        // Notifications
        $user = User::find($validated['user_id']);
        $recipients = collect();

        if ($user && $user->manager_id) {
            $manager = User::find($user->manager_id);
            if ($manager) $recipients->push($manager);
        }

        $admins = User::where('role', 'admin')->get();
        $recipients = $recipients->merge($admins);

        foreach ($recipients as $recipient) {
            $recipient->notify(new LeaveRequestCreated($leaveRequest));
        }

        return response()->json([
            'success' => true,
            'message' => 'Demande de congé enregistrée avec succès.',
            'data' => $leaveRequest,
        ], 201);
    }

    public function getOgcHolidays()
    {
        $holidays = OgcHoliday::all();
        return response()->json($holidays);
    }

    public function changeStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,refused,pending,canceled',
        ], [
            'status.required' => 'Le statut est requis.',
        ]);

        $leaveRequest = LeaveRequest::find($id);

        if (!$leaveRequest) {
            return response()->json(['message' => 'Demande introuvable.'], 404);
        }

        $leaveRequest->status = $request->status;
        $leaveRequest->save();


        return response()->json([
            'message' => "Demande mise à jour avec succès en tant que {$request->status}.",
            'data' => $leaveRequest
        ]);
    }

    public function approveExpiredLeaveRequests()
    {
        $today = Carbon::today();

        LeaveRequest::where('status', 'pending')
            ->whereDate('end_date', '<', $today)
            ->update([
                'status' => 'approved',
                'approved_at' => now(),
                'approved_comment' => 'Approuvé automatiquement car date expirée',
            ]);
    }

    public function getLeaveBalances($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        return response()->json([
            'ogc_leav_bal' => $user->ogc_leav_bal,
            'ogc_perm_bal' => $user->ogc_perm_bal,
            'ogc_othr_bal' => $user->ogc_othr_bal,
        ]);
    }

    public function insertApprovedRequestsIntoOgCumul()
    {
        try {
            $approvedRequests = LeaveRequest::where('status', 'approved')
                ->where('is_inserted_to_ogcumul', false)
                ->get();

            if ($approvedRequests->isEmpty()) {
                return response()->json([
                    'message' => 'Aucune demande approuvée à insérer.',
                    'processed' => [],
                ], 200);
            }

            $results = [];

            foreach ($approvedRequests as $request) {
                try {
                    $userCumul = OgCumul::where('user_id', $request->user_id)->first();

                    $leave = $request->request_type === 'leave' && !is_null($request->number_day) ? $request->number_day : 0;
                    $perm = $request->request_type === 'permission' && !is_null($request->number_day) ? $request->number_day : 0;
                    $other = $request->request_type === 'other' && !is_null($request->number_day) ? $request->number_day : 0;


                    if ($userCumul) {
                        $userCumul->leave_days += $leave;
                        $userCumul->permission_days += $perm;
                        $userCumul->other_days += $other;
                        $userCumul->save();

                        $action = 'updated';
                    } else {
                        OgCumul::create([
                            'user_id' => $request->user_id,
                            'leave_days' => $leave,
                            'permission_days' => $perm,
                            'other_days' => $other,
                        ]);

                        $action = 'created';
                    }

                    $request->is_inserted_to_ogcumul = true;
                    $request->save();

                    $results[] = [
                        'request_id' => $request->id,
                        'user_id' => $request->user_id,
                        'type' => $request->request_type,
                        'number_day' => $request->number_day,
                        'leave' => $leave,
                        'perm' => $perm,
                        'other' => $other,
                        'inserted' => true
                    ];
                } catch (\Exception $e) {
                    $results[] = [
                        'request_id' => $request->id,
                        'user_id' => $request->user_id,
                        'status' => 'error',
                        'error' => $e->getMessage(),
                    ];
                }
            }

            return response()->json([
                'message' => 'Traitement terminé.',
                'processed' => $results,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur critique lors du traitement.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getTeamLeaveRequests($managerId)
    {
        $manager = User::with('teamMembers')->find($managerId);

        if (!$manager) {
            return response()->json(['message' => 'Manager non trouvé'], 404);
        }

        $teamUserIds = $manager->teamMembers->pluck('id');

        $leaveRequests = LeaveRequest::with('user', 'leaveType')
            ->whereIn('user_id', $teamUserIds)
            ->where('status', 'pending')
            ->get();

        return response()->json($leaveRequests);
    }


    public function getAllLeaveRequests()
    {
        $leaveRequests = LeaveRequest::with('user', 'leaveType')->get();

        return response()->json($leaveRequests);
    }

    public function getAllTypeLeave()
    {
        $leavetype = LeaveType::all();
        return response()->json($leavetype);
    }
}
