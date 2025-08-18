<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserDetails;
use Dotenv\Exception\ValidationException;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use phpDocumentor\Reflection\Types\Boolean;
use Illuminate\Validation\ValidationException as ValidationValidationException;


class UserController extends Controller
{

    public function update(Request $request, $id)
    {
        $messages = [
            'email.email' => 'L\'adresse e-mail doit être valide.',
            'email.unique' => 'Cette adresse e-mail est déjà utilisée. Veuillez en choisir une autre.',

            'status.string' => 'Le statut doit être une chaîne de caractères.',
            'last_login.date' => 'La date de dernière connexion doit être une date valide.',

            'role.string' => 'Le rôle doit être une chaîne de caractères.',

            'first_name.string' => 'Le prénom doit être une chaîne de caractères.',
            'first_name.max' => 'Le prénom ne peut pas dépasser 255 caractères.',

            'last_name.string' => 'Le nom doit être une chaîne de caractères.',
            'last_name.max' => 'Le nom ne peut pas dépasser 255 caractères.',

            'position_id.integer' => 'L\'identifiant du poste doit être un nombre entier.',
            'hire_date.date' => 'La date d\'embauche doit être une date valide.',
            'department_id.integer' => 'L\'identifiant du département doit être un nombre entier.',
            'birth_date.date' => 'La date de naissance doit être une date valide.',
            'birth_place.string' => 'Le lieu de naissance doit être une chaîne de caractères.',
            'birth_place.max' => 'Le lieu de naissance ne peut pas dépasser 255 caractères.',

            'employee_number.string' => 'Le numéro matricule doit être une chaîne de caractères.',
            'employee_number.max' => 'Le numéro matricule est trop long (maximum 100 caractères).',

            'cnaps_number.string' => 'Le numéro CNAPS doit être une chaîne de caractères.',
            'cnaps_number.max' => 'Le numéro CNAPS est trop long (maximum 100 caractères).',

            'phone_number.string' => 'Le numéro de téléphone doit être une chaîne de caractères.',
            'phone_number.max' => 'Le numéro de téléphone est trop long (maximum 20 caractères).',

            'address.string' => 'L\'adresse doit être une chaîne de caractères.',
            'class_id.integer' => 'L\'identifiant de la classification doit être un nombre entier.',
            'image.string' => 'L\'image doit être un chemin sous forme de chaîne de caractères.',

            'client_code.string' => 'Le code client doit être une chaîne de caractères.',
            'client_code.max' => 'Le code client est trop long (maximum 100 caractères).',

            'manager_id.integer' => 'L\'identifiant du manager doit être un nombre entier.',
            'leaving_date.date' => 'La date de départ doit être une date valide.',
            'updated_by.integer' => 'Le champ "modifié par" doit être un nombre entier.',
            'leaving_reason.string' => 'Le motif de départ doit être une chaîne de caractères.',

            'gender.in' => 'Le genre doit être "male", "female" ou "other".',
            'gender.string' => 'Le genre doit être une chaîne de caractères.',

            'marital_status.string' => 'L\'état civil doit être une chaîne de caractères.',

            'ogc_leav_bal_init.numeric' => 'Le solde initial des congés OGC doit être un nombre.',
            'ogc_leav_bal_init_date.date' => 'La date du solde initial OGC doit être une date valide.',

            'ogc_leav_bal.numeric' => 'Le solde actuel des congés OGC doit être un nombre.',
            'ogc_leav_bal_date.date' => 'La date du solde actuel OGC doit être une date valide.',

            'ogc_perm_bal.numeric' => 'Le solde permanent OGC doit être un nombre.',
            'ogc_perm_bal_date.date' => 'La date du solde permanent OGC doit être une date valide.',

            'ogc_othr_bal.numeric' => 'Le solde OGC autre doit être un nombre.',
        ];


        try {
            $user = User::findOrFail($id);

            $fields = $request->validate([
                'email' => 'nullable|email|unique:users,email,' . $user->id,
                'status' => 'nullable|string',
                'last_login' => 'nullable|date',
                'role' => 'nullable|string',
                'first_name' => 'nullable|string|max:255',
                'last_name' => 'nullable|string|max:255',
                'position_id' => 'nullable|integer',
                'hire_date' => 'nullable|date',
                'department_id' => 'nullable|integer',
                'birth_date' => 'nullable|date',
                'birth_place' => 'nullable|string|max:255',
                'employee_number' => 'nullable|string|max:100',
                'cnaps_number' => 'nullable|string|max:100',
                'phone_number' => 'nullable|string|max:20',
                'address' => 'nullable|string',
                'class_id' => 'nullable|integer',
                'image' => 'nullable|string',
                'client_code' => 'nullable|string|max:100',
                'manager_id' => 'nullable|integer',
                'leaving_date' => 'nullable|date',
                'updated_by' => 'nullable|integer',
                'leaving_reason' => 'nullable|string',
                'gender' => 'nullable|string|in:male,female,other',
                'marital_status' => 'nullable|string',
                'ogc_leav_bal_init' => 'nullable|numeric',
                'ogc_leav_bal_init_date' => 'nullable|date',
                'ogc_leav_bal' => 'nullable|numeric',
                'ogc_leav_bal_date' => 'nullable|date',
                'ogc_perm_bal' => 'nullable|numeric',
                'ogc_perm_bal_date' => 'nullable|date',
                'ogc_othr_bal' => 'nullable|numeric',
            ], $messages);

            $imagePath = $user->image;
            $imageUrl = null;

            if ($request->hasFile('image')) {
                try {
                    $file = $request->file('image');

                    $extension = $file->getClientOriginalExtension();
                    $filename = 'profile@user' . $user->id . '.' . $extension;

                    $directory = 'users/' . $user->id . '/profil';

                    $disk = Storage::disk('sftp');
                    if (!$disk->exists($directory)) {
                        $disk->makeDirectory($directory);
                    }

                    $imagePath = $file->storeAs($directory, $filename, 'sftp');

                    $imageUrl = 'http://57.128.116.184/intranet/' . $imagePath;

                    $user->update(array_merge(
                        $fields,
                        ['image' => $imagePath]
                    ));
                } catch (Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Erreur lors de la mise à jour de l\'image.',
                        'error' => $e->getMessage(),
                    ], 500);
                }
            }


            return response()->json([
                'user' => $user,
                'image_url' => $imageUrl,
                'message' => 'Utilisateur mis à jour avec succès.'
            ], 200);
        } catch (ValidationException $ve) {
            return response()->json([
                'message' => 'Échec de la validation.',
                'errors' => $ve->errors()
            ], 422);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Utilisateur non trouvé.'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Erreur interne.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
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
                    'position_id' => $user->position ? $user->position->id : null,
                    'classification_id' => $user->classification ? $user->classification->id : null,
                    'client_code' => $user->client ? $user->client->code : null,
                    'department' => $user->department ? $user->department->id : null,
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
        } catch (ModelNotFoundException $e) {
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
