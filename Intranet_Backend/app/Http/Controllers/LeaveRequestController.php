<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use App\Models\OgCumul;
use App\Models\UserDetails;
use Illuminate\Foundation\Exceptions\Renderer\Exception;
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
        try {
            // Étape 1 : validation
            try {
                $validated = $request->validate([
                    'user_id' => 'required|integer|exists:intranet_extedim.users,id',
                    // 'request_type' => 'required|string',
                    'reason' => 'nullable|string',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after_or_equal:start_date',
                    'start_half_day' => 'required',
                    'end_half_day' => 'required',
                    'number_day' => 'required|numeric|min:0.5',
                    'status' => 'required|in:pending,approved,rejected',
                    'approved_at' => 'nullable|date',
                    'approved_by' => 'nullable|integer|exists:intranet_extedim.users,id',
                    'approved_comment' => 'nullable|string',
                    'is_inserted_to_ogcumul' => 'nullable|boolean',
                    'leave_type_id' => 'required|exists:intranet_extedim.ogc_leave_types,id',
                    'support_file_path' => 'nullable|file|mimes:pdf,jpg,png,docx,doc|max:2048',
                ]);
            } catch (\Illuminate\Validation\ValidationException $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation.',
                    'errors' => $e->errors(),
                ], 422);
            }

            $fileUrl = null;

            // Étape 2 : gestion du fichier s'il existe
            if ($request->hasFile('support_file_path')) {
                try {
                    $file = $request->file('support_file_path');

                    $filename = uniqid() . '_' . $file->getClientOriginalName();
                    $directory = 'images/ogc';

                    $storedPath = $file->storeAs($directory, $filename, 'sftp');

                    if (!$storedPath) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Échec de l\'enregistrement du fichier sur le serveur.',
                        ], 500);
                    }

                    $fileUrl = 'https://57.128.116.184/intranet/' . $storedPath;
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Erreur lors du traitement du fichier.',
                        'error' => $e->getMessage(),
                    ], 500);
                }
            }

            // Étape 3 : création de la demande
            try {
                $leaveRequest = LeaveRequest::create([
                    'user_id' => $validated['user_id'],
                    // 'request_type' => $validated['request_type'],
                    'reason' => $validated['reason'] ?? null,
                    'start_date' => $validated['start_date'],
                    'end_date' => $validated['end_date'],
                    'start_half_day' => $validated['start_half_day'],
                    'end_half_day' => $validated['end_half_day'],
                    'number_day' => $validated['number_day'],
                    'status' => $validated['status'],
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

            return response()->json([
                'success' => true,
                'message' => 'Demande de congé enregistrée avec succès.',
                'data' => $leaveRequest,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Erreur inconnue lors de la création de la demande de congé : ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur interne du serveur.',
                'error' => $e->getMessage(),
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
