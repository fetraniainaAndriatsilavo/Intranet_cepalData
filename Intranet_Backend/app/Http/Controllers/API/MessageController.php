<?php

namespace App\Http\Controllers\API;

use App\Events\MessageDeleted;
use App\Events\MessageRead;
use App\Events\ChatMessageSent;
use App\Events\MessageUpdated;
use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use App\Models\Conversation;
use App\Models\File;
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
    public function getConversation($user1, $user2)
    {
        try {
            $userOne = min($user1, $user2);
            $userTwo = max($user1, $user2);

            $conversation = Conversation::where('user_one_id', $userOne)
                ->where('user_two_id', $userTwo)
                ->first();

            if (!$conversation) {
                return response()->json([
                    'status' => 'success',
                    'messages' => [],
                    'conversation_id' => null
                ]);
            }
            $messages = Message::withTrashed()->with('files')
                ->where('conversation_id', $conversation->id)
                ->orderBy('created_at', 'asc')
                ->get();

            $result = $messages->map(function ($msg) {
                return [
                    'id' => $msg->id,
                    'sender_id' => $msg->sender_id,
                    'receiver_id' => $msg->receiver_id,
                    'content' => $msg->trashed() ? 'Message indisponible' : $msg->content,
                    'read_at' => $msg->read_at,
                    'created_at' => $msg->created_at,
                    'deleted' => $msg->trashed(),
                    'files' => $msg->trashed() ? [] : $msg->files->map(function ($file) {
                        return [
                            'path' => $file->path,
                            'original_name' => $file->original_name,
                            'mime_type' => $file->mime_type,
                        ];
                    }),
                ];
            });


            return response()->json([
                'status' => 'success',
                'messages' => $result,
                'conversation_id' => $conversation->id
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la récupération des messages.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


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
            $validator = Validator::make($request->all(), [
                'sender_id' => 'required|integer|min:1|different:receiver_id',
                'receiver_id' => 'required|integer|min:1',
                'content' => 'nullable|string|max:5000',
                // 'files.*' => 'nullable|file|max:10240|mimes:jpg,jpeg,png,gif,pdf,doc,docx,mp4,mp3',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Échec de la validation',
                    'details' => $validator->errors()
                ], 422);
            }

            $sender = User::find($request->sender_id);
            $receiver = User::find($request->receiver_id);
            if (!$sender || !$receiver) {
                return response()->json(['error' => 'Expéditeur ou destinataire introuvable'], 404);
            }

            $user1 = min($sender->id, $receiver->id);
            $user2 = max($sender->id, $receiver->id);
            $conversation = Conversation::firstOrCreate([
                'user_one_id' => $user1,
                'user_two_id' => $user2,
            ]);

            $message = Message::create([
                'sender_id' => $sender->id,
                'receiver_id' => $receiver->id,
                'content' => $request->content,
                'conversation_id' => $conversation->id,
            ]);

            // if ($request->hasFile('files')) {
            //     foreach ($request->file('files') as $file) {
            //         $filename = uniqid() . '_' . $file->getClientOriginalName();
            //         $directory = 'images/files';
            //         $storedPath = $file->storeAs($directory, $filename, 'sftp');

            //         if (!$storedPath) {
            //             throw new Exception("Échec du téléchargement de l’image : " . $filename);
            //         }

            //        File::create([
            //             'message_id' => $message->id,
            //             'path' => $storedPath,
            //             'original_name' => $file->getClientOriginalName(),
            //             'mime_type' => $file->getClientMimeType(),
            //         ]);
            //     }
            // }

            broadcast(new ChatMessageSent($message, $receiver->id, $sender->id));

            return response()->json([
                'message' => 'Message envoyé avec succès',
                'data' => $message->load('files')
            ], 201);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'Erreur lors de l\'insertion dans la base de données',
                'details' => $e->getMessage()
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Erreur inattendue',
                'details' => $e->getMessage()
            ], 500);
        }
    }


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

            $message->delete();

            broadcast(new MessageDeleted($message))->toOthers();

            return response()->json([
                'status' => 'success',
                'message' => 'Message supprimé avec succès.',
                'data' => [
                    'id' => $message->id,
                    'sender_id' => $message->sender_id,
                    'receiver_id' => $message->receiver_id,
                    'deleted' => true,
                ]
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Message non trouvé.'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la suppression.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
