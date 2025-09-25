<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\OgCumul;
use App\Models\User;
use App\Models\UserDetails;
use App\Notifications\ApprovedCommentNotification;
use App\Notifications\LeaveRequestCanceledByUser;
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

        $holidayDates = OgcHoliday::whereBetween('date', [$start, $end])
            ->pluck('date')
            ->map(fn($date) => Carbon::parse($date)->format('Y-m-d'))
            ->toArray();

        $overlapHoliday = collect($period)->first(function ($date) use ($holidayDates) {
            return in_array($date->format('Y-m-d'), $holidayDates);
        });

        if ($overlapHoliday) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de poser un congé sur un jour férié (' . $overlapHoliday->format('d/m/Y') . ').',
            ], 422);
        }

        $numberDay = collect($period)->filter(function ($date) use ($holidayDates) {
            return !$date->isWeekend() && !in_array($date->format('Y-m-d'), $holidayDates);
        })->count();

        if ($validated['start_half_day'] === 'afternoon') $numberDay -= 0.5;
        if ($validated['end_half_day'] === 'morning') $numberDay -= 0.5;

        $user = User::find($validated['user_id']);
        $balanceColumn = null;

        $leaveType = LeaveType::find($validated['leave_type_id']);

        if (!$leaveType) {
            return response()->json([
                'success' => false,
                'message' => 'Type de congé introuvable.'
            ], 404);
        }

        if ($leaveType->is_permission) {
            $balanceColumn = 'ogc_perm_bal';
        } elseif ($leaveType->is_other) {
            $balanceColumn = 'ogc_othr_bal';
        } else {
            $balanceColumn = 'ogc_leav_bal';
        }

        if ($user->$balanceColumn < $numberDay) {
            return response()->json([
                'success' => false,
                'message' => "Solde insuffisant. Votre solde actuel est de {$user->$balanceColumn} jours."
            ], 422);
        }


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

    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'user_id' => 'required|integer|exists:intranet_extedim.users,id',
    //         'reason' => 'nullable|string',
    //         'start_date' => 'required|date|after_or_equal:today',
    //         'end_date' => 'required|date|after_or_equal:start_date',
    //         'start_half_day' => 'required',
    //         'end_half_day' => 'required',
    //         'approved_at' => 'nullable|date',
    //         'approved_by' => 'nullable|integer|exists:intranet_extedim.users,id',
    //         'approved_comment' => 'nullable|string',
    //         'is_inserted_to_ogcumul' => 'nullable|boolean',
    //         'leave_type_id' => 'required|exists:intranet_extedim.ogc_leave_types,id',
    //         'support_file_path' => 'nullable|file|mimes:pdf,jpg,png,docx,doc|max:2048',
    //     ], [
    //         'user_id.required' => 'L’utilisateur est obligatoire.',
    //         'user_id.integer' => 'L’utilisateur doit être un entier.',
    //         'user_id.exists' => 'L’utilisateur sélectionné n’existe pas.',

    //         'reason.string' => 'La raison doit être une chaîne de caractères.',

    //         'start_date.required' => 'La date de début est obligatoire.',
    //         'start_date.date' => 'La date de début doit être une date valide.',
    //         'start_date.after_or_equal' => 'La date de début doit être aujourd’hui ou dans le futur.',

    //         'end_date.required' => 'La date de fin est obligatoire.',
    //         'end_date.date' => 'La date de fin doit être une date valide.',
    //         'end_date.after_or_equal' => 'La date de fin doit être postérieure ou égale à la date de début.',

    //         'start_half_day.required' => 'Veuillez spécifier si la date de début est une demi-journée.',

    //         'end_half_day.required' => 'Veuillez spécifier si la date de fin est une demi-journée.',

    //         'approved_at.date' => 'La date d’approbation doit être une date valide.',

    //         'approved_by.integer' => 'L’utilisateur qui approuve doit être un entier.',
    //         'approved_by.exists' => 'L’utilisateur qui approuve n’existe pas.',

    //         'approved_comment.string' => 'Le commentaire d’approbation doit être une chaîne de caractères.',

    //         'is_inserted_to_ogcumul.boolean' => 'Le champ "inséré dans OGCumul" doit être vrai ou faux.',

    //         'leave_type_id.required' => 'Le type de congé est obligatoire.',
    //         'leave_type_id.exists' => 'Le type de congé sélectionné n’existe pas.',

    //         'support_file_path.file' => 'Le fichier joint doit être un fichier valide.',
    //         'support_file_path.mimes' => 'Le fichier doit être de type : pdf, jpg, png, docx ou doc.',
    //         'support_file_path.max' => 'La taille du fichier ne doit pas dépasser 2 Mo.',
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

    //     $numberDay = collect($period)->filter(function ($date) {
    //         return !$date->isWeekend();
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

    public function getOgcHolidays()
    {
        $holidays = OgcHoliday::all();
        return response()->json($holidays);
    }

    public function approve(Request $request, $id)
    {
        $validated = $request->validate([
            'approved_by' => 'required|integer|exists:intranet_extedim.users,id',
            'approved_comment' => 'nullable|string',
        ]);

        $leaveRequest = LeaveRequest::find($id);
        if (!$leaveRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Demande de congé non trouvée.',
            ], 404);
        }

        if ($leaveRequest->status === 'approved') {
            return response()->json([
                'success' => false,
                'message' => 'Cette demande est déjà approuvée.',
            ], 400);
        }

        $user = User::find($leaveRequest->user_id);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé.',
            ], 404);
        }
        $balanceColumn = null;
        $leaveType = LeaveType::find($leaveRequest->leave_type_id);
        if (!$leaveType) {
            return response()->json([
                'success' => false,
                'message' => 'Type de congé introuvable.',
            ], 404);
        }

        if ($leaveType->is_permission) {
            $balanceColumn = 'ogc_perm_bal';
        } elseif ($leaveType->is_other) {
            $balanceColumn = 'ogc_othr_bal';
        } else {
            $balanceColumn = 'ogc_leav_bal';
        }


        if (!isset($user->$balanceColumn)) {
            return response()->json([
                'success' => false,
                'message' => "Solde utilisateur pour $balanceColumn est nul ou inconnu.",
            ], 500);
        }

        if ($user->$balanceColumn < $leaveRequest->number_day) {
            return response()->json([
                'success' => false,
                'message' => 'Solde insuffisant pour approuver cette demande.',
            ], 422);
        }

        $user->decrement($balanceColumn, $leaveRequest->number_day);

        $leaveRequest->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => $validated['approved_by'],
            'approved_comment' => $validated['approved_comment'] ?? null,
        ]);

        try {
            $user->notify(new \App\Notifications\LeaveRequestStatusNotification($leaveRequest));
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => "Erreur lor de l'envoie du notification" . $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Demande de congé approuvée avec succès.',
            'data' => $leaveRequest,
        ], 200);
    }

    public function cancel(Request $request, $id)
    {
        $leaveRequest = LeaveRequest::find($id);
        if (!$leaveRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Demande de congé non trouvée.',
            ], 404);
        }

        if ($leaveRequest->status === 'canceled') {
            return response()->json([
                'success' => false,
                'message' => 'Cette demande est déjà annulée.',
            ], 400);
        }

        if (Carbon::parse($leaveRequest->end_date)->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible d\'annuler une demande dont la date est déjà passée.',
            ], 422);
        }

        $user = User::find($leaveRequest->user_id);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur associé à cette demande non trouvé.',
            ], 404);
        }

        if ($leaveRequest->status === 'approved') {
            $balanceColumn = null;
            $leaveType = LeaveType::find($leaveRequest->leave_type_id);
            if (!$leaveType) {
                return response()->json([
                    'success' => false,
                    'message' => 'Type de congé introuvable.',
                ], 404);
            }

            if ($leaveType->is_permission) {
                $balanceColumn = 'ogc_perm_bal';
            } elseif ($leaveType->is_other) {
                $balanceColumn = 'ogc_othr_bal';
            } else {
                $balanceColumn = 'ogc_leav_bal';
            }

            if ($balanceColumn) {
                if (!isset($user->$balanceColumn)) {
                    return response()->json([
                        'success' => false,
                        'message' => "Solde utilisateur pour $balanceColumn est nul ou inconnu.",
                    ], 500);
                }

                try {
                    $user->increment($balanceColumn, $leaveRequest->number_day);
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => "Impossible de récréditer le solde utilisateur : {$balanceColumn}" . $e->getMessage(),
                    ], 500);
                }
            }
        }

        try {
            $leaveRequest->update(['status' => 'canceled']);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'annulation de la demande.',
                'error' => $e->getMessage(),
            ], 500);
        }

        $recipients = collect();

        if ($user->manager_id) {
            $manager = User::find($user->manager_id);
            if ($manager) {
                $recipients->push($manager);
            }
        }

        $admins = User::where('role', 'admin')->get();
        $recipients = $recipients->merge($admins);

        $recipients = $recipients->unique('id');

        foreach ($recipients as $recipient) {
            try {
                $recipient->notify(new LeaveRequestCanceledByUser($leaveRequest, $user));
            } catch (\Exception $e) {
                Log::error("Erreur notification cancel leaveRequest: " . $e->getMessage());
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Demande de congé annulée avec succès.',
            'data' => $leaveRequest,
        ], 200);
    }

    public function reject(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'approved_by' => 'required|integer|exists:intranet_extedim.users,id',
                'approved_comment' => 'nullable|string',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides.',
                'errors' => $e->errors(),
            ], 422);
        }

        $leaveRequest = LeaveRequest::find($id);
        if (!$leaveRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Demande de congé non trouvée.',
            ], 404);
        }

        switch ($leaveRequest->status) {
            case 'rejected':
                return response()->json([
                    'success' => false,
                    'message' => 'Cette demande a déjà été refusée.',
                ], 400);
            case 'canceled':
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de refuser une demande déjà annulée.',
                ], 400);
            case 'approved':
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de refuser une demande déjà approuvée.',
                ], 400);
            case 'created':
            default:
                break;
        }

        $user = User::find($leaveRequest->user_id);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur associé à cette demande non trouvé.',
            ], 404);
        }

        try {
            $leaveRequest->update([
                'status' => 'refused',
                'approved_at' => now(),
                'approved_by' => $validated['approved_by'],
                'approved_comment' => $validated['approved_comment'] ?? 'Demande refusée',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de la demande.',
                'error' => $e->getMessage(),
            ], 500);
        }

        try {
            $user->notify(new \App\Notifications\LeaveRequestStatusNotification($leaveRequest));
        } catch (\Exception $e) {
            Log::error("Erreur notification leaveRequest (refus) : " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Demande de congé refusée avec succès.',
            'data' => $leaveRequest,
        ], 200);
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

    public function getLeaveRequestsUser($userid)
    {
        $leaveRequests = LeaveRequest::with('user', 'leaveType')
            ->where('user_id', $userid)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($leaveRequests);
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
            ->where('status', 'created')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($leaveRequests);
    }

    public function getAllLeaveRequests()
    {
        $leaveRequests = LeaveRequest::with('user', 'leaveType')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getAllTypeLeave()
    {
        $leavetype = LeaveType::all();
        return response()->json($leavetype);
    }
}
