<?php

namespace App\Http\Controllers\API;

use App\Models\Group;
use App\Models\MessageGroup;
use App\Models\MessageGroupUser;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB as FacadesDB;
use Illuminate\Validation\ValidationException;

class GroupController extends Controller
{
    public function getGroupInfo($groupId)
    {
        try {
            $group = MessageGroup::with(['users' => function ($q) {
                $q->select('users.id', 'users.first_name', 'users.last_name', 'users.email');
            }])->findOrFail($groupId);

            return response()->json([
                'success' => true,
                'group' => [
                    'id' => $group->id,
                    'name' => $group->name,
                    'updated_at' => $group->updated_at,
                    'updated_by' => $group->updated_by,
                    'members' => $group->users->map(function ($user) {
                        return [
                            'id' => $user->id,
                            'first_name' => $user->first_name,
                            'last_name' => $user->last_name,
                            'email' => $user->email,
                            'is_admin' => (bool) $user->pivot->is_admin, // pivot dispo direct ici
                        ];
                    })
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du groupe',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getMembers($groupId)
    {
        try {
            $group = MessageGroup::with(['users' => function ($query) {
                $query->select('users.id', 'users.first_name', 'users.last_name', 'users.email');
            }])->findOrFail($groupId);

            return response()->json([
                'success' => true,
                'group' => [
                    'id' => $group->id,
                    'name' => $group->name,
                    'members' => $group->users->map(function ($user) {
                        return [
                            'id' => $user->id,
                            'first_name' => $user->first_name,
                            'last_name' => $user->last_name,
                            'email' => $user->email,
                            'is_admin' => $user->pivot->is_admin
                        ];
                    })
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUserGroups($userId)
    {
        try {
            $user = User::findOrFail($userId);

            $groups = $user->messageGroups()->with(['users' => function ($q) {
                $q->select('users.id', 'users.first_name', 'users.last_name', 'users.email');
            }])->get();

            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->first_name . ' ' . $user->last_name,
                    'groups' => $groups->map(function ($group) {
                        return [
                            'id' => $group->id,
                            'name' => $group->name,
                            'members' => $group->users->map(function ($user) {
                                return [
                                    'id' => $user->id,
                                    'first_name' => $user->first_name,
                                    'last_name' => $user->last_name,
                                    'email' => $user->email,
                                    'is_admin' => $user->pivot->is_admin
                                ];
                            })
                        ];
                    })
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des groupes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'users' => 'required|array|min:1',
            'users.*' => 'integer|exists:intranet_extedim.users,id',
            'admin_id' => 'required|integer|exists:intranet_extedim.users,id',
        ]);

        FacadesDB::beginTransaction();

        try {
            $group = MessageGroup::create([
                'name' => $request->name,
                'updated_by' => $request->admin_id,
            ]);

            $users = $request->users;
            if (!in_array($request->admin_id, $users)) {
                $users[] = $request->admin_id;
            }

            foreach ($users as $userId) {
                MessageGroupUser::create([
                    'group_id' => $group->id,
                    'user_id' => $userId,
                    'is_admin' => $userId == $request->admin_id ? 1 : 0,
                ]);
            }

            FacadesDB::commit();

            return response()->json([
                'success' => true,
                'group' => $group->load('users')
            ], 201);
        } catch (\Exception $e) {
            FacadesDB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du groupe',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function addUsers(Request $request, $groupId)
    {
        $request->validate([
            'users' => 'required|array|min:1',
            'users.*' => 'integer|exists:intranet_extedim.users,id',
        ]);

        $group = MessageGroup::findOrFail($groupId);

        $userData = [];
        foreach ($request->users as $userId) {
            $userData[$userId] = ['is_admin' => 0];
        }

        $group->users()->syncWithoutDetaching($userData);

        return response()->json([
            'success' => true,
            'message' => 'Utilisateurs ajoutés au groupe',
            'group' => $group->load('users')
        ]);
    }
    public function removeUser(Request $request, $groupId)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:intranet_extedim.users,id',
        ]);

        $group = MessageGroup::findOrFail($groupId);

        $group->users()->detach($request->user_id);

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur retiré du groupe',
            'group' => $group->load('users')
        ]);
    }

    public function leaveGroup(Request $request, $groupId)
    {
        $userId = $request->user_id;

        $group = MessageGroup::findOrFail($groupId);

        if (!$group->users()->where('user_id', $userId)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'êtes pas membre de ce groupe'
            ], 403);
        }

        $group->users()->detach($userId);

        return response()->json([
            'success' => true,
            'message' => 'Vous avez quitté le groupe',
            'group' => $group->load('users')
        ]);
    }

    public function update(Request $request, $groupId)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'updated_by' => 'required|integer|exists:intranet_extedim.users,id',
        ]);

        try {
            $group = MessageGroup::findOrFail($groupId);

            $group->update([
                'name' => $request->name,
                'updated_by' => $request->updated_by,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Nom du groupe mis à jour avec succès',
                'group' => $group
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du groupe',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($groupId)
    {
        $group = MessageGroup::findOrFail($groupId);

        $group->users()->detach();

        $group->delete();

        return response()->json([
            'success' => true,
            'message' => 'Groupe supprimé avec succès'
        ]);
    }
}
