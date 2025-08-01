<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserDetails;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use phpDocumentor\Reflection\Types\Boolean;
use Illuminate\Validation\ValidationException as ValidationValidationException;


class UserController extends Controller
{


    public function toggleStatus(Request $request, $id)
    {

        $user = User::findOrFail($id);

        $newStatus = $request->input('status', $user->status === 'active' ? 'archived' : 'active');


        $user->status = $newStatus;

        $user->save();

        return response()->json([
            'message' => 'Statut mis à jour avec succès',
            'user' => $user
        ]);
    }


    public function getPersonalUser($id)
    {
        return User::where('id', $id)->get();
    }

    public function getAllManagers()
    {
        $managers = User::where('role', 'manager')->orWhere('role', 'admin')->get();

        if ($managers->isEmpty()) {
            return response()->json([
                'message' => 'Aucun manager trouvé.'
            ], 404);
        }

        return response()->json([
            'message' => 'Liste des managers récupérée avec succès.',
            'data' => $managers
        ], 200);
    }

    public function getNotifications()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur non authentifié.'
            ], 401);
        }

        return response()->json([
            'message' => 'Notifications récupérées avec succès.',
            'notifications' => $user->notifications
        ]);
    }


    public function changePassword(Request $request, $userId)
    {
        try {
            $user = User::find($userId);

            if (!$user) {
                return response()->json(['message' => 'Utilisateur non trouvé.'], 404);
            }

            $request->validate([
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8',
            ]);

            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json(['message' => 'Mot de passe actuel incorrect.'], 403);
            }

            $user->password = Hash::make($request->new_password);
            $user->save();

            return response()->json(['message' => 'Mot de passe mis à jour.']);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Erreur serveur.',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    public function GetInfoUser($id)
    {
        try {
            $user = User::with('position', 'classification', 'client', 'manager', 'documents')->findOrFail($id);

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'email' => $user->email,
                    'status' => $user->status,
                    'role' => $user->role,
                    'birth_date' => $user->birth_date,
                    'birth_place' => $user->birth_place,
                    'employee_number' => $user->employee_number,
                    'cnaps_number' => $user->cnaps_number,
                    'phone_number' => $user->phone_number,
                    'address' => $user->address,
                    'image' => $user->image,
                    'leaving_date' => $user->leaving_date,
                    'leaving_reason' => $user->leaving_reason,
                    'gender' => $user->gender,
                    'marital_status' => $user->marital_status,
                    'ogc_leav_init' => $user->ogc_leav_init,
                    'ogc_leav_bal' => $user->ogc_leav_bal,
                    'ogc_leav_date' => $user->ogc_leav_date,
                    'ogc_perm_bal' => $user->ogc_perm_bal,
                    'ogc_perm_bal_date' => $user->ogc_perm_bal_date,
                    'ogc_othr_bal' => $user->ogc_othr_bal,
                    'ogc_othr_bal_date' => $user->ogc_othr_bal_date,
                    'position_name' => $user->position ? $user->position->name : null,
                    'classification_name' => $user->classification ? $user->classification->categ_name : null,
                    'client_code' => $user->client ? $user->client->name : null,
                    'department' => $user->department ? $user->department->name : null,
                    'manager' => $user->manager ? $user->manager->first_name : null,
                    'documents' => $user->documents->map(
                        function ($doc) {
                            return [
                                'id' => $doc->id,
                                'file_name' => $doc->file_name,
                                'file_path' => $doc->file_path,
                                'status' => $doc->status,
                                'description' => $doc->description,
                                'uploaded_at' => $doc->uploaded_at,
                                'doc_type' => optional($doc->type)->name,
                            ];
                        }
                    ),
                ],

            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Utilisateur non trouvé.',
                'message' => 'Aucun utilisateur ne correspond à cet ID.',
                'details' => 'L\'utilisateur avec l\'ID spécifié n\'existe pas dans la base de données.',
            ], 404);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'error' => 'Erreur de base de données.',
                'message' => 'Problème lors de l\'exécution de la requête SQL.',
                'details' => 'La requête a échoué lors de la tentative de récupération des relations de l\'utilisateur.',
                'sql_error' => $e->getMessage(),
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Erreur interne.',
                'message' => 'Une erreur est survenue lors de la récupération des données.',
                'details' => 'Nous rencontrons un problème interne, veuillez réessayer plus tard.',
                'exception_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }

    public function GetAllUsers()
    {
        try {
            $users = User::with('position', 'classification', 'client', 'manager', 'documents')->get();

            $formattedUsers = $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'email' => $user->email,
                    'position_name' => $user->position ? $user->position->name : null,
                    'classification_name' => $user->classification ? $user->classification->categ_name : null,
                    'client_code' => $user->client ? $user->client->name : null,
                    'department' => $user->department ? $user->department->name : null,
                    'manager' => $user->manager ? $user->manager->first_name : null,
                    'documents' => $user->documents->map(function ($doc) {
                        return [
                            'id' => $doc->id,
                            'file_name' => $doc->file_name,
                            'file_path' => $doc->file_path,
                            'status' => $doc->status,
                            'description' => $doc->description,
                            'uploaded_at' => $doc->uploaded_at,
                            'doc_type' => optional($doc->type)->name,
                        ];
                    }),
                ];
            });

            return response()->json([
                'users' => $formattedUsers,
            ], 200);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'error' => 'Erreur de base de données.',
                'message' => 'Impossible de récupérer les utilisateurs.',
                'sql_error' => $e->getMessage(),
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Erreur interne.',
                'message' => 'Une erreur est survenue.',
                'exception_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], 500);
        }
    }
}
