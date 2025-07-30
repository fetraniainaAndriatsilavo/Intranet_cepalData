<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use App\Models\OgCumul;
use App\Models\UserDetails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use LeaveRequestStatusNotification;

class LeaveRequestController extends Controller
{
    /**
     * Crée une nouvelle demande de congé/permission/autre
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:intranet_extedim.users,id',
            'request_type' => 'required|in:leave,permission,other',
            'reason' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'start_half_day' => 'required',
            'end_half_day' => 'required',
            'number_day' => 'required|numeric',
        ], [


            'request_type.required' => 'Le type de demande est requis.',
            'request_type.in' => 'Le type de demande doit être leave, permission ou other.',

            'reason.required' => 'Le motif de la demande est requis.',
            'reason.string' => 'Le motif doit être une chaîne de caractères.',

            'start_date.required' => 'La date de début est requise.',
            'start_date.date' => 'La date de début doit être une date valide.',

            'end_date.required' => 'La date de fin est requise.',
            'end_date.date' => 'La date de fin doit être une date valide.',
            'end_date.after_or_equal' => 'La date de fin doit être égale ou postérieure à la date de début.',

            'start_half_day.required' => 'La demi-journée de début est requise.',
            'start_half_day.in' => 'La demi-journée de début doit être morning ou afternoon.',

            'end_half_day.required' => 'La demi-journée de fin est requise.',
            'end_half_day.in' => 'La demi-journée de fin doit être morning ou afternoon.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $leaveRequest = LeaveRequest::create([
                'user_id' => $request->user_id,
                'request_type' => $request->request_type,
                'reason' => $request->reason,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'start_half_day' => $request->start_half_day,
                'end_half_day' => $request->end_half_day,
                'number_day' => $request->number_day,
                'status' => 'pending',
            ]);

            Log::info('Leave request created successfully', ['data' => $leaveRequest]);

            return response()->json([
                'message' => 'Demande créée avec succès.',
                'data' => $leaveRequest
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error while creating leave request: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur interne du serveur.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function approvedStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,refused',
        ], [
            'status.required' => 'Le statut est requis.',
            'status.in' => 'Le statut doit être approved ou refused.',
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
    public function refusedStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,refused',
            'commentaire' => 'required'
        ], [
            'status.required' => 'Le statut est requis.',
            'status.in' => 'Le statut doit être approved ou refused.',
            'commentaire.required' => 'Le commentaire est requis.',

        ]);

        $leaveRequest = LeaveRequest::find($id);

        if (!$leaveRequest) {
            return response()->json(['message' => 'Demande introuvable.'], 404);
        }

        $leaveRequest->status = $request->status;
        $leaveRequest->commentaire = $request->commentaire;

        $leaveRequest->save();

        return response()->json([
            'message' => "Demande mise à jour avec succès en tant que {$request->status}.",
            'data' => $leaveRequest
        ]);
    }

    public function getAllRequests()
    {
        $allRequests = LeaveRequest::with([
            'user' => function ($q) {
                $q->select('id', 'name');
            },
            'user.userDetail' => function ($q) {
                $q->select('user_id', 'dossier');
            }
        ])->get();

        if ($allRequests->isEmpty()) {
            return response()->json([
                'message' => 'Aucune demande trouvée.'
            ], 404);
        }

        $formatted = $allRequests->map(function ($req) {
            $user = $req->user;
            $userDetail = $user?->userDetail;

            return [
                'id' => $req->id,
                'user_id' => $req->user_id,
                'user_exists' => $user ? true : false,
                'user_detail_exists' => $userDetail ? true : false,
                'name' => $user->name ?? 'Utilisateur inconnu',
                'dossier' => $userDetail->dossier ?? 'Dossier inconnu',
                'request_type' => $req->request_type,
                'reason' => $req->reason,
                'start_date' => $req->start_date,
                'end_date' => $req->end_date,
                'start_half_day' => $req->start_half_day,
                'end_half_day' => $req->end_half_day,
                'number_day' => $req->number_day,
                'status' => $req->status,
                'is_inserted_to_ogcumul' => $req->is_inserted_to_ogcumul,
                'created_at' => $req->created_at,
                'updated_at' => $req->updated_at,
            ];
        });

        return response()->json([
            'message' => 'Toutes les demandes récupérées avec succès.',
            'data' => $formatted
        ], 200);
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

    public function getTeamRequests($managerId)
    {
        try {
            $teamUserIds = UserDetails::where('manager_id', $managerId)->pluck('user_id');

            if ($teamUserIds->isEmpty()) {
                return response()->json([
                    'message' => 'Aucun employé assigné à ce manager.'
                ], 404);
            }

            $requests = LeaveRequest::with('user:id,name,email')
                ->whereIn('user_id', $teamUserIds)
                ->where('status', 'pending')
                ->get()
                ->map(function ($request) {
                    return [
                        'id' => $request->id,
                        'request_type' => $request->request_type,
                        'start_date' => $request->start_date,
                        'end_date' => $request->end_date,
                        'status' => $request->status,
                        'reason' => $request->reason,
                        'created_at' => $request->created_at,
                        'updated_at' => $request->updated_at,
                        'user_id' => $request->user->id ?? null,
                        'user_name' => $request->user->name ?? null,
                        'user_email' => $request->user->email ?? null,
                    ];
                });

            if ($requests->isEmpty()) {
                return response()->json([
                    'message' => 'Aucune demande en attente trouvée pour les membres de l’équipe.'
                ], 404);
            }

            return response()->json([
                'message' => 'Demandes en attente de l’équipe récupérées avec succès.',
                'data' => $requests
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des demandes.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getTeamCumul($managerId)
    {
        try {
            // Étape 1 : Récupérer les IDs des utilisateurs de l’équipe du manager
            $teamUserIds = UserDetails::where('manager_id', $managerId)->pluck('user_id');
            // Vérification : pas de membres d’équipe
            if ($teamUserIds->isEmpty()) {
                return response()->json([
                    'message' => 'Aucun employé assigné à ce manager.'
                ], 404);
            }

            $cumuls = OgCumul::whereIn('user_id', $teamUserIds)
                ->select('id', 'user_id', 'leave_days', 'permission_days', 'other_days')
                ->with('user:id,name,email', 'user.userDetail:id,user_id,first_name,last_name')
                ->get();

            if ($cumuls->isEmpty()) {
                return response()->json([
                    'message' => 'Aucun cumul trouvé pour les membres de l’équipe.'
                ], 404);
            }

            return response()->json([
                'message' => 'Cumuls des membres de l’équipe récupérés avec succès.',
                'data' => $cumuls,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la récupération des cumuls.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
