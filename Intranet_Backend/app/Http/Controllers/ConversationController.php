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
}
