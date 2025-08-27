<?php

namespace App\Http\Controllers\API;

use App\Events\GroupMessageSent;
use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Exception;

class GroupMessageController extends Controller
{
    public function index($groupId)
    {

        // $table = [];
        try {
            if (!is_numeric($groupId) || $groupId <= 0) {
                return response()->json([
                    'error' => 'ID du groupe invalide. Il doit être un nombre positif.'
                ], 400);
            }

            $group = Group::find($groupId);
            if (!$group) {
                return response()->json([
                    'error' => 'Groupe introuvable. Vérifie l\'ID fourni.'
                ], 404);
            }

            $messages = Message::withTrashed()->with('sender')
                ->where('group_id', $groupId)
                ->orderBy('created_at', 'asc')
                ->get();

            if ($messages->isEmpty()) {
                return response()->json([
                    // 'tableau' => $table,
                    'message' => 'Aucun message dans ce groupe pour le moment.'
                ], 200);
            }

            $formatted = $messages->map(function ($msg) {
                return [
                    'id' => $msg->id,
                    'sender_id' => $msg->sender_id,
                    'sender_name' => $msg->sender ? $msg->sender->name : 'Inconnu',
                    'content' => $msg->trashed() ? 'Message indisponible' : $msg->content,
                    'deleted' => $msg->trashed(),
                    'created_at' => $msg->created_at
                ];
            });

            return response()->json([
                'message' => 'Messages récupérés avec succès.',
                'data' => $formatted
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des messages.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function getGroup($groupId)
    {
        try {
            if (!is_numeric($groupId) || $groupId <= 0) {
                return response()->json([
                    'error' => 'ID du groupe invalide'
                ], 400);
            }

            $group = Group::find($groupId);

            if (!$group) {
                return response()->json([
                    'error' => 'Groupe introuvable'
                ], 404);
            }

            return response()->json([
                'message' => 'Groupe trouvé',
                'data' => [
                    'id' => $group->id,
                    'name' => $group->name,
                ]
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération du groupe',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request, $groupId)
    {
        try {
            if (!is_numeric($groupId) || $groupId <= 0) {
                return response()->json(['error' => 'ID du groupe invalide'], 400);
            }

            $group = Group::find($groupId);
            if (!$group) {
                return response()->json(['error' => 'Groupe introuvable'], 404);
            }

            $validator = Validator::make($request->all(), [
                'sender_id' => 'required|integer|exists:intranet_extedim.users,id',
                'content' => 'required|string|max:5000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Échec de la validation',
                    'details' => $validator->errors()
                ], 422);
            }

            $isMember = DB::table('intranet_extedim.group_user')
                ->where('group_id', $groupId)
                ->where('user_id', $request->sender_id)
                ->exists();

            if (!$isMember) {
                return response()->json(['error' => 'Tu n\'es pas membre de ce groupe'], 403);
            }

            $message = Message::create([
                'sender_id' => $request->sender_id,
                'group_id' => $groupId,
                'content' => $request->content,
            ]);

            broadcast(new GroupMessageSent($message))->toOthers();

            return response()->json([
                'message' => 'Message envoyé dans le groupe',
                'data' => $message
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Erreur inattendue lors de l\'envoi du message',
                'details' => $e->getMessage()
            ], 500);
        }
    }
    public function getGroupUsers($groupId)
    {
        try {
            if (!is_numeric($groupId) || $groupId <= 0) {
                return response()->json(['error' => 'ID de groupe invalide'], 400);
            }

            $group = Group::with('users')->find($groupId);

            if (!$group) {
                return response()->json(['error' => 'Groupe introuvable'], 404);
            }

            return response()->json([
                'message' => 'Utilisateurs du groupe récupérés avec succès.',
                'group_name' => $group->name,
                'total_users' => $group->users->count(),
                'users' => $group->users->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,

                    ];
                })
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des utilisateurs.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function latestGroupMessages($userId)
    {
        try {
            $groupIds = DB::table('intranet_extedim.group_user')
                ->where('user_id', $userId)
                ->pluck('group_id');

            $groups = Group::with(['conversation', 'latestMessage.sender'])
                ->whereIn('id', $groupIds)
                ->get();

            $data = $groups->map(function ($group) {
                $lastMessage = $group->latestMessage;

                return [
                    'group_id' => $group->id,
                    'group_name' => $group->name,
                    'last_message' => $lastMessage ? [
                        'sender_name' => $lastMessage->sender->name ?? 'Inconnu',
                        'content' => $lastMessage->content,
                        'created_at' => $lastMessage->created_at,
                    ] : null
                ];
            });

            return response()->json([
                'status' => 'success',
                'data' => $data
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la récupération.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function removeUserFromGroup($groupId, $userId)
    {
        try {
            $group = Group::find($groupId);

            if (!$group) {
                return response()->json(['error' => 'Groupe introuvable'], 404);
            }

            $isMember = DB::table('intranet_extedim.group_user')
                ->where('group_id', $groupId)
                ->where('user_id', $userId)
                ->exists();

            if (!$isMember) {
                return response()->json(['error' => 'Utilisateur non membre du groupe'], 400);
            }

            $group->users()->detach($userId);

            return response()->json([
                'message' => "Utilisateur supprimé du groupe avec succès."
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la suppression.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function leaveGroup(Request $request, $groupId)
    {
        try {
            $userId = $request->input('user_id');

            $group = Group::find($groupId);

            if (!$group) {
                return response()->json(['error' => 'Groupe introuvable'], 404);
            }

            $isMember = DB::table('intranet_extedim.group_user')
                ->where('group_id', $groupId)
                ->where('user_id', $userId)
                ->exists();

            if (!$isMember) {
                return response()->json(['error' => 'Tu ne fais pas partie de ce groupe'], 400);
            }

            $group->users()->detach($userId);

            return response()->json([
                'message' => 'Vous avez quitté le groupe.'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la sortie du groupe.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function getLeftUsers($id)
    {
        $group = Group::with('users')->find($id);

        if (!$group) {
            return response()->json(['error' => 'Groupe introuvable'], 404);
        }

        $excludedIds = $group->users->pluck('id')->toArray();

        $remain_Users = User::whereNotIn('id', $excludedIds)->get();

        return response()->json($remain_Users);
    }
}
