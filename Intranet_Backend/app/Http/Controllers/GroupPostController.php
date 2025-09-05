<?php


namespace App\Http\Controllers;

use App\Models\GroupPost;
use App\Models\Post;
use App\Models\User;
use App\Notifications\NewGroupPostAdded;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB as FacadesDB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rule;

class GroupPostController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|unique:intranet_extedim.posts_groups,name',
                'creator_id' => 'required|exists:intranet_extedim.users,id',
                'user_ids' => 'required|array|min:1',
                'user_ids.*' => 'exists:intranet_extedim.users,id',
            ], [
                'name.required' => 'Le nom du groupe est obligatoire.',
                'name.unique' => 'Ce nom du groupe existe déjà.',
                'creator_id.required' => 'Le créateur du groupe est requis.',
                'user_ids.required' => 'Veuillez sélectionner au moins un utilisateur pour ce groupe.',
                'user_ids.array' => 'La liste des utilisateurs doit être un tableau.',
                'user_ids.min' => 'Le groupe doit contenir au moins un utilisateur.',
                'user_ids.*.exists' => 'Un ou plusieurs utilisateurs sont introuvables.',
            ]);

            $group = GroupPost::create([
                'name' => $request->name,
                'created_by' => $request->creator_id,
                'updated_by' => $request->creator_id,
            ]);

            $group->members()->attach($request->creator_id, [
                'joined_at' => now(),
                'role' => 'administrator',
            ]);

            foreach ($request->user_ids as $userId) {
                if ($userId != $request->creator_id) {
                    $group->members()->attach($userId, [
                        'joined_at' => now(),
                        'role' => 'member',
                    ]);
                }
            }

            $creator = User::find($request->creator_id);

            $usersToNotify = User::whereIn('id', $request->user_ids)
                ->where('id', '!=', $creator->id)
                ->get();

            Notification::send($usersToNotify, new NewGroupPostAdded($group, $creator));

            return response()->json([
                'message' => 'Groupe créé avec succès.',
                'group' => $group->load('members'),
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
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

    public function postsByGroup($groupId)
    {
        $allPosts = Post::with('attachments', 'user')
            ->published()
            ->withTrashed()
            ->where('group_id', $groupId)
            ->orderBy('created_at', 'desc')
            ->get();

        if ($allPosts->isEmpty()) {
            return response()->json([
                'success' => true,
                'message' => 'Aucune publication disponible.',
                'posts'   => [],
            ], 200);
        }

        return response()->json([
            'success' => true,
            'posts'   => $allPosts,
        ], 200);
    }

    public function getMembers($groupId)
    {
        $group = GroupPost::with(['members'])->findOrFail($groupId);

        return response()->json([
            'group' => [
                'id' => $group->id,
                'name' => $group->name,
            ],
            'members' => $group->members->map(function ($user) {
                return [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'image' => $user->image,
                    'joined_at' => $user->pivot->joined_at ?? null,
                    'role' => $user->pivot->role ?? 'member',
                ];
            })
        ]);
    }

    public function groupsByUser($userId)
    {
        try {
            $user = User::with('groupPosts')->findOrFail($userId);

            $groups = $user->groupPosts->map(function ($group) {
                return [
                    'id' => $group->id,
                    'name' => $group->name,
                    'role' => $group->pivot->role,
                    'joined_at' => $group->pivot->joined_at,
                    'created_by' => $group->created_by,
                ];
            });

            return response()->json([
                'user_id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'image' => $user->image,
                'groups' =>  $groups
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Utilisateur introuvable.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur serveur.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function addMembers(Request $request, $groupId)
    {
        try {
            // Validation des user_ids
            $request->validate([
                'user_ids' => 'required|array|min:1',
                'user_ids.*' => 'exists:intranet_extedim.users,id',
            ], [
                'user_ids.required' => 'Veuillez fournir une liste d’utilisateurs.',
                'user_ids.array' => 'La liste des utilisateurs doit être un tableau.',
                'user_ids.min' => 'Au moins un utilisateur est requis.',
                'user_ids.*.exists' => 'Un ou plusieurs utilisateurs sont introuvables.'
            ]);

            $group = GroupPost::findOrFail($groupId);

            $added = [];
            $alreadyMembers = [];

            foreach ($request->user_ids as $userId) {
                if ($group->members()->where('user_id', $userId)->exists()) {
                    $alreadyMembers[] = $userId;
                } else {
                    $group->members()->attach($userId, [
                        'joined_at' => now(),
                        'role' => 'member',
                    ]);
                    $added[] = $userId;
                }
            }

            $messageParts = [];
            if (!empty($added)) {
                $messageParts[] = "Utilisateurs ajoutés : " . implode(', ', $added);
            }
            if (!empty($alreadyMembers)) {
                $messageParts[] = "Déjà membres : " . implode(', ', $alreadyMembers);
            }

            return response()->json([
                'success' => true,
                'group_id' => $group->id,
                'added_user_ids' => $added,
                'already_member_user_ids' => $alreadyMembers,
                'message' => implode(' | ', $messageParts)
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Échec de la validation.',
                'details' => $e->errors(),
            ], 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => "Groupe introuvable avec l'ID $groupId",
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erreur serveur.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function removeMember($groupId, $userId)
    {
        try {
            $group = GroupPost::findOrFail($groupId);

            if (!$group->members->contains($userId)) {
                return response()->json([
                    'message' => "Cet utilisateur n'est pas membre du groupe."
                ], 404);
            }

            $group->members()->detach($userId);

            return response()->json([
                'message' => "L'utilisateur a été retiré du groupe avec succès."
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la suppression.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateName(Request $request, $groupId)
    {
        $request->validate([

            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('intranet_extedim.posts_groups')->ignore($groupId),
            ],

            'user_ids' => 'nullable|array',
            'user_ids.*' => 'exists:intranet_extedim.users,id',
        ], [
            'name.required' => 'Le nouveau nom du groupe est obligatoire.',
            'name.unique' => 'Ce nom du groupe existe déjà.',
            'name.string' => 'Le nom doit être une chaîne de caractères.',
            'name.max' => 'Le nom ne doit pas dépasser 255 caractères.',
        ]);

        try {
            $group = GroupPost::findOrFail($groupId);
            $group->name = $request->name;
            $group->save();
            $added = [];
            $alreadyMembers = [];

            foreach ($request->user_ids as $userId) {
                if ($group->members()->where('user_id', $userId)->exists()) {
                    $alreadyMembers[] = $userId;
                } else {
                    $group->members()->attach($userId, [
                        'joined_at' => now(),
                        'role' => 'member',
                    ]);
                    $added[] = $userId;
                }
            }

            $messageParts = [];
            if (!empty($added)) {
                $messageParts[] = "Utilisateurs ajoutés : " . implode(', ', $added);
            }
            if (!empty($alreadyMembers)) {
                $messageParts[] = "Déjà membres : " . implode(', ', $alreadyMembers);
            }

            return response()->json([
                'message' => 'Nom du groupe mis à jour avec succès.',
                'group' => [
                    'id' => $group->id,
                    'name' => $group->name,
                ],
                'added_user_ids' => $added,
                'already_member_user_ids' => $alreadyMembers,
                'messageParts' => implode(' | ', $messageParts)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise à jour du nom du groupe.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($groupId)
    {
        try {
            $group = GroupPost::findOrFail($groupId);

            $group->members()->detach();

            Post::where('group_id', $group->id)->delete();

            $group->delete();

            return response()->json([
                'message' => "Le groupe a été supprimé avec succès."
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => "Groupe introuvable."
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Erreur lors de la suppression.",
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
