<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ConversationController extends Controller
{
    public function getConversation($user_id)
    {
        try {
            $conversations = Conversation::with([
                'userOne:id,name',
                'userTwo:id,name',
                'messages' => function ($query) {
                    $query->latest()->limit(1);
                }
            ])
                ->where('user_one_id', $user_id)
                ->orWhere('user_two_id', $user_id)
                ->orderBy('created_at', 'desc')
                ->get();

            if ($conversations->isEmpty()) {
                return response()->json([
                    'status' => 'empty',
                    'message' => 'Aucune conversation trouvée.'
                ], 404);
            }

            $result = $conversations->map(function ($conv) use ($user_id) {

                $withUser = $conv->user_one_id == $user_id ? $conv->userTwo : $conv->userOne;

                $lastMessage = Message::where('conversation_id', $conv->id)
                    ->orderBy('created_at', 'desc')
                    ->first();


                return [
                    'conversation_id' => $conv->id,
                    'id' => $withUser->id,
                    'name' => $withUser->name,
                    'message' => $lastMessage->content,
                    'is_read' => $lastMessage->read_at,
                    'sender_id' => $lastMessage->sender_id,
                ];
            });

            return response()->json([
                'status' => 'success',
                'data' => $result
            ], 200);
        } catch (Exception $e) {
            Log::error('Erreur récupération conversation : ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Erreur serveur.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // public function myConversations($userId)
    // {

    //     $conversations = Conversation::where('user_one_id', $userId)
    //         ->orWhere('user_two_id', $userId)
    //         ->with(['userOne', 'userTwo'])
    //         ->orderBy('updated_at', 'desc')
    //         ->get();

    //     return response()->json($conversations);
    // }
    public function myConversations($userId)
    {
        $conversations = Conversation::where(function ($query) use ($userId) {
            $query->where('user_one_id', $userId)
                ->orWhere('user_two_id', $userId);
        })
            ->with(['userOne', 'userTwo'])
            ->with(['lastMessage' => function ($q) {
                $q->latest();
            }])
            ->orderByDesc(
                Message::select('created_at')
                    ->whereColumn('conversation_id', 'conversations.id')
                    ->latest()
                    ->take(1)
            )
            ->get();

        return response()->json($conversations);
    }


    public function getConversationInfo($conversationId)
    {
        try {
            $conversation = Conversation::with([
                'messages.sender',
                'userOne:id,first_name,last_name,email',
                'userTwo:id,first_name,last_name,email'
            ])->find($conversationId);

            if (!$conversation) {
                return response()->json([
                    'success' => false,
                    'message' => 'Conversation non trouvée'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'conversation' => [
                    'id' => $conversation->id,
                    'user_one' => $conversation->userOne,
                    'user_two' => $conversation->userTwo,
                    'messages' => $conversation->messages->map(function ($msg) {
                        return [
                            'id' => $msg->id,
                            'content' => $msg->content,
                            'status' => $msg->status,
                            'is_read' => $msg->is_read,
                            'created_at' => $msg->created_at, 
                            'files' => $msg->files,
                            'sender' => $msg->sender,
                        ];
                    })
                ]
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la conversation',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    public function destroy($conversationId)
    {
        $conversation = Conversation::findOrFail($conversationId);


        $conversation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Groupe supprimé avec succès'
        ]);
    }
}
