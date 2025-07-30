<?php

namespace App\Http\Controllers\API;

use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB as FacadesDB;
use Illuminate\Validation\ValidationException;

class GroupController extends Controller
{
    // public function store(Request $request)
    // {
    //     try {
    //         $request->validate([
    //             'name' => 'required|string',
    //             'user_ids' => 'required|array|min:1',
    //         ], [
    //             'name.required' => 'Le nom du groupe est obligatoire.',
    //             'name.string' => 'Le nom du groupe doit être une chaîne de caractères.',
    //             'user_ids.required' => 'Veuillez sélectionner au moins un utilisateur pour ce groupe.',
    //             'user_ids.array' => 'La liste des utilisateurs doit être un tableau.',
    //             'user_ids.min' => 'Le groupe doit contenir au moins un utilisateur.',
    //         ]);

    //         $group = Group::create(['name' => $request->name]);
    //         $group->users()->attach($request->user_ids);

    //         return response()->json([
    //             'message' => 'Groupe créé avec succès.',
    //             'group' => $group->load('users')
    //         ], 201);
    //     } catch (ValidationException $e) {
    //         return response()->json([
    //             'erreur' => 'Échec de la validation des données.',
    //             'détails' => $e->errors(),
    //         ], 422);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'erreur' => 'Une erreur est survenue lors de la création du groupe.',
    //             'message' => $e->getMessage()
    //         ], 500);
    //     }
    // }
    public function store(Request $request)
    {
        try {
            // Validation
            $request->validate([
                'name' => 'required|string',
                'user_ids' => 'required|array|min:1|exists:intranet_extedim.users,id',
            ], [
                'name.required' => 'Le nom du groupe est obligatoire.',
                'name.string' => 'Le nom du groupe doit être une chaîne de caractères.',
                'user_ids.required' => 'Veuillez sélectionner au moins un utilisateur pour ce groupe.',
                'user_ids.array' => 'La liste des utilisateurs doit être un tableau.',
                'user_ids.min' => 'Le groupe doit contenir au moins un utilisateur.',
            ]);

            // Créer le groupe
            $group = Group::create(['name' => $request->name]);

            // Ajouter l'utilisateur qui crée comme admin par défaut
            $creatorId = $request->creator_id; // ici on prend l'ID de l'utilisateur qui crée

            // Vérifier le nombre d'admins existants dans le groupe
            $adminCount = $group->users()->wherePivot('is_admin', true)->count();
            if ($adminCount >= 2) {
                return response()->json([
                    'message' => 'Le nombre maximum d\'admins est atteint pour ce groupe.',
                ], 400);
            }

            // Ajouter l'utilisateur créateur comme admin
            $group->users()->attach($creatorId, ['is_admin' => true]);

            // Ajouter les autres utilisateurs
            foreach ($request->user_ids as $userId) {
                if ($userId != $creatorId) {
                    // Vérifier à nouveau avant d'ajouter un autre admin
                    $adminCount = $group->users()->wherePivot('is_admin', true)->count();
                    if ($adminCount >= 2) {
                        break; // Si le nombre d'admins est déjà 2, on arrête d'ajouter des admins
                    }
                    $group->users()->attach($userId, ['is_admin' => false]);
                }
            }

            return response()->json([
                'message' => 'Groupe créé avec succès.',
                'group' => $group->load('users'),
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'erreur' => 'Échec de la validation des données.',
                'détails' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'erreur' => 'Une erreur est survenue lors de la création du groupe.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function addUserToGroup(Request $request, $groupId)
    {
        try {
            // Validation des données
            $request->validate([
                'user_id' => 'required|exists:intranet_extedim.users,id',
                'is_admin' => 'nullable|boolean', 
            ], [
                'user_id.required' => 'L\'ID de l\'utilisateur est obligatoire.',
                'user_id.exists' => 'L\'utilisateur n\'existe pas.',
                'is_admin.boolean' => 'Le statut admin doit être vrai ou faux.',
            ]);

            // Récupérer le groupe
            $group = Group::findOrFail($groupId);

            // Vérifier combien d'admins il y a déjà
            $adminCount = $group->users()->wherePivot('is_admin', true)->count();

            // Si l'utilisateur est admin, vérifier que la limite de 2 admins n'est pas dépassée
            if ($request->is_admin && $adminCount >= 2) {
                return response()->json([
                    'message' => 'Le nombre maximum d\'admins est atteint pour ce groupe.',
                ], 400);
            }

            // Ajouter l'utilisateur au groupe
            $group->users()->attach($request->user_id, ['is_admin' => $request->is_admin ?? false]);

            return response()->json([
                'message' => 'Utilisateur ajouté au groupe avec succès.',
                'group' => $group->load('users'),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'erreur' => 'Une erreur est survenue.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    public function index()
    {
        try {
            $groups = Group::with('users')->get();
            return response()->json($groups);
        } catch (\Exception $e) {
            return response()->json([
                'erreur' => 'Impossible de récupérer les groupes.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getUserGroups($id)
    {
        $user = User::with('groups')->findOrFail($id);

        return response()->json([
            'groups' => $user->groups
        ]);
    } 

    public function deleteGroup($id)
    {
        $deleted = FacadesDB::table('groups')->where('group_id', $id)->delete();

        if ($deleted) {
            return response()->json(['message' => 'Group deleted successfully.']);
        } else {
            return response()->json(['message' => 'Group not found or already deleted.'], 404);
        }
    }
}
