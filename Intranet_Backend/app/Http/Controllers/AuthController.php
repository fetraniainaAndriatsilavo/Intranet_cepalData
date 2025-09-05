<?php

namespace App\Http\Controllers;

use App\Mail\WelcomeUserMail;
use App\Models\User;
use App\Models\UserDetails;
use App\Notifications\WelcomeUserNotification;
use Dotenv\Exception\ValidationException;
use Exception;
use Illuminate\Container\Attributes\Log as AttributesLog;
use Illuminate\Contracts\Mail\Mailer;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException as ValidationValidationException;


class AuthController extends Controller
{
    public function register(Request $request)
    {
        $messages = [
            'email.required' => 'L\'adresse e-mail est requise.',
            'email.email' => 'L\'adresse e-mail doit être valide.',
            'email.unique' => 'Cette adresse e-mail est déjà utilisée. Veuillez en choisir une autre.',

            'status.string' => 'Le statut doit être une chaîne de caractères.',
            'last_login.date' => 'La date de dernière connexion doit être une date valide.',

            'role.required' => 'Le rôle est requis.',
            'role.string' => 'Le rôle doit être une chaîne de caractères.',

            'first_name.string' => 'Le prénom doit être une chaîne de caractères.',
            'first_name.max' => 'Le prénom ne peut pas dépasser 255 caractères.',

            'last_name.string' => 'Le nom doit être une chaîne de caractères.',
            'last_name.max' => 'Le nom ne peut pas dépasser 255 caractères.',

            // position_id
            'position_id.required' => 'L\'identifiant du poste est requis.',
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

            // image (upload)
            'image.image' => 'Le fichier doit être une image.',
            'image.mimes' => 'L\'image doit être de type : jpeg, png, jpg, gif ou webp.',
            'image.max' => 'L\'image ne doit pas dépasser 2 Mo.',

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

            // type (contrat)
            'type.required' => 'Le type de contrat est requis.',
            'type.exists' => 'Le type de contrat sélectionné est invalide.',

            'first_name.unique' => 'Une personne avec ce prénom et ce nom existe déjà.',

        ];

        try {
            $fields = $request->validate([
                'email' => 'required|email|unique:intranet_extedim.users,email',
                'status' => 'nullable|string',
                'last_login' => 'nullable|date',
                'role' => 'required|string',
                'first_name' => [
                    'nullable',
                    'string',
                    'max:255',
                    Rule::unique('intranet_extedim.users')->where(function ($query) use ($request) {
                        return $query->where('last_name', $request->last_name);
                    }),
                ],
                'last_name' => 'nullable|string|max:255',
                'position_id' => 'required|integer',
                'hire_date' => 'nullable|date',
                'department_id' => 'nullable|integer',
                'birth_date' => 'nullable|date',
                'birth_place' => 'nullable|string|max:255',
                'employee_number' => 'nullable|string|max:100',
                'cnaps_number' => 'nullable|string|max:100',
                'phone_number' => 'nullable|string|max:20',
                'address' => 'nullable|string',
                'class_id' => 'nullable|integer',
                'image' => 'nullable',
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
                'type' => 'required|exists:intranet_extedim.contracts_type,code',

            ], $messages);
            $defaultPassword = 'intranet2025';

            // Création du user
            $user = User::create([
                'email' => $fields['email'],
                'password' => bcrypt($defaultPassword),
                'status' => $fields['status'] ?? null,
                'role' => $fields['role'],
                'first_name' => $fields['first_name'] ?? null,
                'last_name' => $fields['last_name'] ?? null,
                'position_id' => $fields['position_id'] ?? null,
                'hire_date' => $fields['hire_date'] ?? null,
                'department_id' => $fields['department_id'] ?? null,
                'birth_date' => $fields['birth_date'] ?? null,
                'birth_place' => $fields['birth_place'] ?? null,
                'employee_number' => $fields['employee_number'] ?? null,
                'cnaps_number' => $fields['cnaps_number'] ?? null,
                'phone_number' => $fields['phone_number'] ?? null,
                'address' => $fields['address'] ?? null,
                'class_id' => $fields['class_id'] ?? null,
                'client_code' => $fields['client_code'] ?? null,
                'manager_id' => $fields['manager_id'] ?? null,
                'leaving_date' => $fields['leaving_date'] ?? null,
                'updated_by' => $fields['updated_by'] ?? null,
                'leaving_reason' => $fields['leaving_reason'] ?? null,
                'gender' => $fields['gender'] ?? null,
                'marital_status' => $fields['marital_status'] ?? null,
                'ogc_leav_bal_init' => $fields['ogc_leav_bal_init'] ?? null,
                'ogc_leav_bal_init_date' => $fields['ogc_leav_bal_init_date'] ?? null,
                'ogc_leav_bal' => $fields['ogc_leav_bal'] ?? null,
                'ogc_leav_bal_date' => $fields['ogc_leav_bal_date'] ?? null,
                'ogc_perm_bal' => $fields['ogc_perm_bal'] ?? null,
                'ogc_perm_bal_date' => $fields['ogc_perm_bal_date'] ?? null,
                'ogc_othr_bal' => $fields['ogc_othr_bal'] ?? null,
                'contrat_code' => $fields['type'] ?? null,
            ]);

            // Gestion de l'image si fournie
            $imageUrl = null;
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $extension = $file->getClientOriginalExtension();
                $filename = 'profile@user' . $user->id . '.' . $extension;

                $directory = 'users/' . $user->id . '/profil';
                $imagePath = $file->storeAs($directory, $filename, 'sftp');

                $imageUrl = 'http://57.128.116.184/intranet/' . $imagePath;

                $user->image = $imageUrl;
                $user->save();
            }

            // Notification
            $user->notify(new WelcomeUserNotification($defaultPassword));

            return response()->json([
                'user' => $user,
                'type contrat' => $user->load('contrat'),
                'image_url' => $imageUrl,
            ], 201);
        } catch (ValidationException $ve) {
            if (User::where('first_name', $fields['first_name'])
                ->where('last_name', $fields['last_name'])
                ->exists()
            ) {
                return response()->json([
                    'message' => 'Échec de la validation.',
                    'errors' => [
                        'first_name' => ['Une personne avec ce prénom et ce nom existe déjà.']
                    ]
                ], 422);
            }
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Erreur interne.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                "email" => "required|email",
                "password" => "required"
            ], [
                'email.required' => 'L\'email est requis.',
                'email.email' => 'L\'email n\'est pas valide.',
                'password.required' => 'Le mot de passe est requis.',
            ]);

            Log::info('Tentative de connexion pour : ' . $request->email);

            $user = User::where("email", $request->email)->first();

            if (!$user) {
                Log::warning('Aucun utilisateur trouvé avec cet email : ' . $request->email);
                return response()->json([
                    'message' => 'Utilisateur non trouvé avec cet email.'
                ], 401);
            }

            if (!Hash::check($request->password, $user->password)) {
                Log::warning('Mot de passe invalide pour l\'email : ' . $request->email);
                return response()->json([
                    'message' => 'Mot de passe incorrect.'
                ], 401);
            }

            if ($user->status !== 'active') {
                Log::warning('Utilisateur inactif : ' . $request->email . ', statut : ' . $user->status);
                return response()->json([
                    'message' => 'Votre compte est ' . $user->status . '. Veuillez contacter le support.'
                ], 403);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('Connexion réussie pour : ' . $request->email);

            return response()->json([
                'success' => true,
                'message' => 'Connexion réussie.',
                'user' => $user->only(['id', 'first_name', 'last_name', 'email', 'gender', 'role']),
                'token' => $token
            ], 200);
        } catch (\Throwable $e) {
            Log::error('Erreur lors de la tentative de login : ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur : ' . $e->getMessage(),
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:intranet_extedim.users,id',
        ]);

        $user = User::find($validated['user_id']);

        $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tous les tokens de cet utilisateur ont été supprimés.',
        ]);
    }
}
