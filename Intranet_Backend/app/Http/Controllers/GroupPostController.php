<?php


namespace App\Http\Controllers;

use App\Models\GroupPost;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB as FacadesDB;
use Illuminate\Support\Facades\Log;

class GroupPostController extends Controller
{

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string',
                'creator_id' => 'required|exists:intranet_extedim.users,id',
                'user_ids' => 'required|array|min:1',
                'user_ids.*' => 'exists:intranet_extedim.users,id',
            ], [
                'name.required' => 'Le nom du groupe est obligatoire.',
                'creator_id.required' => 'Le créateur du groupe est requis.',
                'user_ids.required' => 'Veuillez sélectionner au moins un utilisateur pour ce groupe.',
                'user_ids.array' => 'La liste des utilisateurs doit être un tableau.',
                'user_ids.min' => 'Le groupe doit contenir au moins un utilisateur.',
                'user_ids.*.exists' => 'Un ou plusieurs utilisateurs sont introuvables.',
            ]);

            $group = GroupPost::create([
                'name' => $request->name,
                'created_by' => $request->creator_id,
            ]);

            $group->members()->attach($request->creator_id, [
                'joined_at' => now(),
                'role' => 'admin',
            ]);

            foreach ($request->user_ids as $userId) {
                if ($userId != $request->creator_id) {
                    $group->members()->attach($userId, [
                        'joined_at' => now(),
                        'role' => 'member',
                    ]);
                }
            }

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
                'trace' => $e->getTrace(),
            ], 500);
        }
    }
    public function postsByGroup($groupId)
    {
        try {
            $group = GroupPost::with(['posts.images', 'posts.user', 'posts.user.userDetail'])->findOrFail($groupId);

            $formattedPosts = $group->posts->map(function ($post) {
                return [
                    'post_id' => $post->id,
                    'user_id' => $post->user_id,
                    'content' => $post->content,
                    'created_at' => $post->created_at->diffForHumans(),
                    'user' => [
                        'name' => $post->user->name,
                        'profile_image' => optional($post->user->userDetail)->image,
                    ],
                    'images' => $post->images->map(function ($image) {
                        return [
                            'id' => $image->id,
                            'url' => $image->url,
                        ];
                    }),
                ];
            });

            return response()->json([
                'groupe' => $group->name,
                'posts' => $formattedPosts
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'erreur' => "Groupe introuvable avec l'ID $groupId"
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'erreur' => 'Erreur serveur.',
                'message' => $e->getMessage()
            ], 500);
        }
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
                    'name' => $user->name,
                    'email' => $user->email,
                    'profile_image' => optional($user->userDetail)->image ?? null,
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
                'name' => $user->name,
                'groups' => $groups
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
            'name' => 'required|string|max:255',
        ], [
            'name.required' => 'Le nouveau nom du groupe est obligatoire.',
            'name.string' => 'Le nom doit être une chaîne de caractères.',
            'name.max' => 'Le nom ne doit pas dépasser 255 caractères.',
        ]);

        try {
            $group = GroupPost::findOrFail($groupId);
            $group->name = $request->name;
            $group->save();

            return response()->json([
                'message' => 'Nom du groupe mis à jour avec succès.',
                'group' => [
                    'id' => $group->id,
                    'name' => $group->name,
                ],
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
