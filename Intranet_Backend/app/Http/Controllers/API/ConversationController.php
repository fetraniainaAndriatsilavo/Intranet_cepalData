<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'sender_id' => 'required|exists:users,id',
                'receiver_id' => 'nullable|exists:users,id',
                'content'   => 'required|string',
                'conversation_id' => 'nullable|exists:conversations,id',
                'group_id'  => 'nullable|exists:groups,id',
            ]);

            if (!empty($data['receiver_id']) && empty($data['conversation_id']) && empty($data['group_id'])) {
                $conversation = \App\Models\Conversation::where(function ($q) use ($data) {
                    $q->where('user_one_id', $data['sender_id'])
                        ->where('user_two_id', $data['receiver_id']);
                })
                    ->orWhere(function ($q) use ($data) {
                        $q->where('user_one_id', $data['receiver_id'])
                            ->where('user_two_id', $data['sender_id']);
                    })
                    ->first();

                if (!$conversation) {
                    $conversation = \App\Models\Conversation::create([
                        'user_one_id' => $data['sender_id'],
                        'user_two_id' => $data['receiver_id'],
                    ]);
                }

                $data['conversation_id'] = $conversation->id;
            }

            if (empty($data['conversation_id']) && empty($data['group_id'])) {
                return response()->json([
                    'success' => false,
                    'error'   => 'Aucune conversation, groupe ou receiver_id spécifié.',
                    'debug'   => $data,
                ], 422);
            }

            $message = \App\Models\Message::create([
                'sender_id'       => $data['sender_id'],
                'content'         => $data['content'],
                'conversation_id' => $data['conversation_id'] ?? null,
                'group_id'        => $data['group_id'] ?? null,
                'is_read'         => false,
                'status'          => 'sent',
            ]);

            // broadcast(new \App\Events\MessageSent($message))->toOthers();

            return response()->json([
                'success' => true,
                'message' => $message,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error'   => 'Erreur interne',
                'debug'   => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
            ], 500);
        }
    }
}
