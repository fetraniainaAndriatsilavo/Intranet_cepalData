<?php

namespace App\Http\Controllers\API;

use App\Events\MessageDeleted;
use App\Events\MessageRead;
use App\Events\ChatMessageSent;
use App\Events\UserMessageSent;
use App\Events\MessageUpdated;
use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use App\Models\Conversation;
use App\Models\File;
use App\Models\MessageGroup;
use App\Notifications\NewMessageNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class MessageController extends Controller
{
    // public function getConversation($user1, $user2)
    // {
    //     $messages = Message::where(function ($query) use ($user1, $user2) {
    //         $query->where('sender_id', $user1)
    //             ->where('receiver_id', $user2);
    //     })
    //         ->orWhere(function ($query) use ($user1, $user2) {
    //             $query->where('sender_id', $user2)
    //                 ->where('receiver_id', $user1);
    //         })
    //         ->orderBy('created_at', 'asc')
    //         ->get();

    //     return response()->json($messages);
    // } 
    // public function getConversation($user1, $user2)
    // {
    //     try {
    //         $userOne = min($user1, $user2);
    //         $userTwo = max($user1, $user2);

    //         $conversation = Conversation::where('user_one_id', $userOne)
    //             ->where('user_two_id', $userTwo)
    //             ->first();

    //         if (!$conversation) {
    //             return response()->json([
    //                 'status' => 'success',
    //                 'messages' => [],
    //                 'conversation_id' => null
    //             ]);
    //         }
    //         $messages = Message::withTrashed()->with('files')
    //             ->where('conversation_id', $conversation->id)
    //             ->orderBy('created_at', 'asc')
    //             ->get();

    //         $result = $messages->map(function ($msg) {
    //             return [
    //                 'id' => $msg->id,
    //                 'sender_id' => $msg->sender_id,
    //                 'receiver_id' => $msg->receiver_id,
    //                 'content' => $msg->trashed() ? 'Message indisponible' : $msg->content,
    //                 'read_at' => $msg->read_at,
    //                 'created_at' => $msg->created_at,
    //                 'deleted' => $msg->trashed(),
    //                 'files' => $msg->trashed() ? [] : $msg->files->map(function ($file) {
    //                     return [
    //                         'path' => $file->path,
    //                         'original_name' => $file->original_name,
    //                         'mime_type' => $file->mime_type,
    //                     ];
    //                 }),
    //             ];
    //         });


    //         return response()->json([
    //             'status' => 'success',
    //             'messages' => $result,
    //             'conversation_id' => $conversation->id
    //         ]);
    //     } catch (Exception $e) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Erreur lors de la récupération des messages.',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }


    public function index(Request $request)
    {
        $conversation_id = $request->query('conversation_id');
        $sender_id = $request->query('sender_id');

        if (!$conversation_id || !$sender_id) {
            return response()->json([
                'error' => 'conversation_id and sender_id are required'
            ], 400);
        }

        $messages = Message::where('conversation_id', $conversation_id)
            ->where('sender_id', $sender_id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'sender_id'       => 'required|exists:intranet_extedim.users,id',
                'receiver_id'     => 'nullable|exists:intranet_extedim.users,id',
                'content'         => 'nullable|string',
                'conversation_id' => 'nullable|exists:intranet_extedim.conversations,id',
                'group_id'        => 'nullable|exists:intranet_extedim.messages_groups,id',
                'status'          => 'required|string',
                'attachments.*'   => 'nullable|file|max:10240',
            ]);

            if (!empty($data['receiver_id']) && empty($data['conversation_id']) && empty($data['group_id'])) {
                $conversation = Conversation::where(function ($q) use ($data) {
                    $q->where('user_one_id', $data['sender_id'])
                        ->where('user_two_id', $data['receiver_id']);
                })->orWhere(function ($q) use ($data) {
                    $q->where('user_one_id', $data['receiver_id'])
                        ->where('user_two_id', $data['sender_id']);
                })->first();

                if (!$conversation) {
                    $conversation = Conversation::create([
                        'user_one_id' => $data['sender_id'],
                        'user_two_id' => $data['receiver_id'],
                    ]);
                }

                $data['conversation_id'] = $conversation->id;
            }

            if (empty($data['conversation_id']) && empty($data['group_id'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucune conversation ou groupe spécifié.',
                    'debug' => $data
                ], 422);
            }

            $message = Message::create([
                'sender_id'      => $data['sender_id'],
                'content'        => $data['content'] ?? null,
                'conversation_id' => $data['conversation_id'] ?? null,
                'group_id'       => $data['group_id'] ?? null,
                'is_read'        => false,
                'status'         => $data['status']
            ]);

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $extension     = $file->getClientOriginalExtension();
                    $originalName  = $file->getClientOriginalName();
                    $mimeType      = $file->getClientMimeType();

                    $filename = 'message_' . $message->id . '_' . time() . '.' . $extension;

                    if (!empty($data['conversation_id'])) {
                        $directory = "discussion/user_{$data['sender_id']}/conversation_{$data['conversation_id']}";
                    } elseif (!empty($data['group_id'])) {
                        $directory = "discussion/user_{$data['sender_id']}/group_{$data['group_id']}";
                    } else {
                        $directory = "discussion/user_{$data['sender_id']}/misc";
                    }

                    $storedPath = $file->storeAs($directory, $filename, 'sftp');

                    if (!$storedPath) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Échec de l\'upload du fichier "' . $originalName . '".',
                        ], 500);
                    }

                    $fileUrl = 'https://57.128.116.184/intranet/' . $storedPath;

                    $message->files()->create([
                        'path'          => $fileUrl,
                        'original_name' => $originalName,
                        'mime_type'     => $mimeType,
                    ]);
                }
            }


            $messageWithUser = $message->load('sender:id,first_name,last_name,email', 'files');

            // broadcast(new UserMessageSent($messageWithUser))->toOthers();

            if (!empty($data['receiver_id'])) {
                $receiver = User::find($data['receiver_id']);
                // if ($receiver) {
                //     $receiver->notify(new NewMessageNotification($messageWithUser));
                // }
            } elseif (!empty($data['group_id'])) {
                $groupMembers = MessageGroup::find($data['group_id'])
                    ->users()
                    ->where('id', '!=', $data['sender_id'])
                    ->get();

                // foreach ($groupMembers as $member) {
                //     $member->notify(new NewMessageNotification($messageWithUser));
                // }
            }

            return response()->json([
                'success' => true,
                'message' => $messageWithUser
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur interne lors de l’envoi du message',
                'error'   => $e->getMessage(),
                'line'    => $e->getLine(),
                'file'    => $e->getFile()
            ], 500);
    }
}



    // public function store(Request $request)
    // {
    //     try {
    //         $data = $request->validate([
    //             'sender_id'       => 'required|exists:users,id',
    //             'content'         => 'required|string',
    //             'conversation_id' => 'nullable|exists:conversations,id',
    //             'group_id'        => 'nullable|exists:groups,id',
    //         ]);

    //         if (empty($data['conversation_id']) && empty($data['group_id'])) {
    //             return response()->json([
    //                 'success' => false,
    //                 'error'   => 'Aucune conversation ou groupe spécifié.',
    //                 'debug'   => $data,
    //             ], 422);
    //         }

    //         $message = Message::create([
    //             'sender_id'       => $data['sender_id'],
    //             'content'         => $data['content'],
    //             'conversation_id' => $data['conversation_id'] ?? null,
    //             'group_id'        => $data['group_id'] ?? null,
    //             'is_read'         => false,
    //             'status'          => 'active',
    //         ]);

    //         if (!$message) {
    //             return response()->json([
    //                 'success' => false,
    //                 'error'   => 'Impossible de créer le message en base.',
    //                 'debug'   => $data,
    //             ], 500);
    //         }

    //         try {
    //             broadcast(new MessageSent($message))->toOthers();
    //         } catch (Exception $e) {
    //             return response()->json([
    //                 'success' => false,
    //                 'error'   => 'Échec du broadcast.',
    //                 'debug'   => [
    //                     'message_id' => $message->id,
    //                     'exception'  => $e->getMessage(),
    //                     'trace'      => $e->getTraceAsString(),
    //                 ],
    //             ], 500);
    //         }

    //         return response()->json([
    //             'success' => true,
    //             'message' => $message,
    //         ], 201);
    //     } catch (\Illuminate\Validation\ValidationException $e) {
    //         return response()->json([
    //             'success' => false,
    //             'error'   => 'Erreur de validation.',
    //             'details' => $e->errors(),
    //             'input'   => $request->all(),
    //         ], 422);
    //     } catch (Exception $e) {
    //         return response()->json([
    //             'success' => false,
    //             'error'   => 'Erreur interne.',
    //             'debug'   => [
    //                 'exception' => $e->getMessage(),
    //                 'trace'     => $e->getTraceAsString(),
    //             ],
    //             'input' => $request->all(),
    //         ], 500);
    //     }
    // }


    // public function store(Request $request)
    // {
    //     try {
    //         $data = $request->validate([
    //             'sender_id' => 'required|exists:users,id',
    //             'receiver_id' => 'nullable|exists:users,id',
    //             'content'   => 'required|string',
    //             'conversation_id' => 'nullable|exists:conversations,id',
    //             'group_id'  => 'nullable|exists:groups,id',
    //             'status' => 'required'
    //         ]);

    //         if (!empty($data['receiver_id']) && empty($data['conversation_id']) && empty($data['group_id'])) {

    //             $conversation = Conversation::where(function ($q) use ($data) {
    //                 $q->where('user_one_id', $data['sender_id'])
    //                     ->where('user_two_id', $data['receiver_id']);
    //             })
    //                 ->orWhere(function ($q) use ($data) {
    //                     $q->where('user_one_id', $data['receiver_id'])
    //                         ->where('user_two_id', $data['sender_id']);
    //                 })
    //                 ->first();

    //             if (!$conversation) {
    //                 $conversation = Conversation::create([
    //                     'user_one_id' => $data['sender_id'],
    //                     'user_two_id' => $data['receiver_id'],
    //                 ]);
    //             }

    //             $data['conversation_id'] = $conversation->id;
    //         }

    //         if (empty($data['conversation_id']) && empty($data['group_id'])) {
    //             return response()->json([
    //                 'success' => false,
    //                 'error'   => 'Aucune conversation, groupe ou receiver_id spécifié.',
    //                 'debug'   => $data,
    //             ], 422);
    //         }

    //         $message = Message::create([
    //             'sender_id'       => $data['sender_id'],
    //             'content'         => $data['content'],
    //             'conversation_id' => $data['conversation_id'] ?? null,
    //             'group_id'        => $data['group_id'] ?? null,
    //             'is_read'         => false,
    //             'status'          => $data['status'],
    //         ]);

    //         broadcast(new UserMessageSent($message))->toOthers();

    //         return response()->json([
    //             'success' => true,
    //             'message' => $message,
    //         ], 201);
    //     } catch (Exception $e) {
    //         return response()->json([
    //             'success' => false,
    //             'error'   => 'Erreur interne',
    //             'debug'   => $e->getMessage(),
    //             'trace'   => $e->getTraceAsString(),
    //         ], 500);
    //     }
    // }

    public function getMessage($id)
    {
        $message = Message::findOrFail($id);
        return response()->json($message);
    }


    public function markAsRead(Request $request, $id)
    {
        try {
            if (!is_numeric($id) || $id <= 0) {
                return response()->json(['error' => 'ID de message invalide'], 400);
            }

            $message = Message::find($id);
            if (!$message) {
                return response()->json(['error' => 'Message introuvable'], 404);
            }

            $userId = $request->input('user_id');

            if ($message->receiver_id !== $userId) {
                return response()->json([
                    'error' => 'Accès non autorisé : vous n\'êtes pas le destinataire prévu'
                ], 403);
            }

            if ($message->read_at) {
                return response()->json([
                    'message' => 'Message déjà marqué comme lu',
                    'data' => $message
                ], 200);
            }

            $message->update(['read_at' => true]);

            broadcast(new MessageRead($message))->toOthers();

            return response()->json([
                'message' => 'Message marqué comme lu',
                'data' => $message
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la mise à jour : ' . $e->getMessage()
            ], 500);
        }
    }



    public function update(Request $request, $id)
    {
        try {
            $message = Message::withTrashed()->findOrFail($id);

            if ($message->trashed()) {
                return response()->json([
                    'error' => 'Ce message a été supprimé et ne peut pas être modifié.'
                ], 403);
            }

            $validated = $request->validate([
                'content' => 'nullable'
            ]);

            $message->content = $validated['content'];
            $message->save();
            $message->refresh();


            broadcast(new MessageUpdated($message))->toOthers();

            return response()->json([
                'status' => 'success',
                'message' => 'Message mis à jour avec succès.',
                'data' => [
                    'id' => $message->id,
                    'sender_id' => $message->sender_id,
                    'receiver_id' => $message->receiver_id,
                    'content' => $message->content,
                    'updated_at' => $message->updated_at,
                    'created_at' => $message->created_at
                ]
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Message non trouvé.'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la mise à jour.',
                'details' => $e->getMessage()
            ], 500);
        }
    }


    public function destroy($id)
    {
        try {
            $message = Message::findOrFail($id);

            $message->update([
                'status' => 'inactive'
            ]);

            broadcast(new MessageDeleted($message))->toOthers();

            return response()->json([
                'status' => 'success',
                'message' => 'Message marqué comme inactif avec succès.',
                'data' => [
                    'id' => $message->id,
                    'sender_id' => $message->sender_id,
                    'receiver_id' => $message->receiver_id,
                    'status' => $message->status,
                ]
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Message non trouvé.'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la mise à jour du statut.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
