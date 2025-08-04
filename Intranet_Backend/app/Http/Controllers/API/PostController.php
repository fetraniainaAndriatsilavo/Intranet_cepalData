<?php

namespace App\Http\Controllers\Api;

use App\Events\NewCommentPosted;
use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\PostImage;
use App\Models\Reaction;
use App\Models\User;
use App\Notifications\PostStatusUpdated;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException as ValidationValidationException;


class PostController extends Controller
{
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $fields = $request->validate([
                "user_id" => "required|exists:intranet_extedim.users,id",
                "content" => "nullable|string",
                "group_id" => "nullable",
                "images.*" => "nullable",
                'type' => 'required'
            ]);

            $user = User::find($fields['user_id']);

            $isAdmin = $user && ($user->role === 'admin' || $user->is_admin === true);

            $post = Post::create([
                'user_id' => $fields['user_id'],
                'content' => $fields['content'],
                'group_id' => $fields['group_id'] ?? null,
                'status' => $isAdmin ? 'published' : 'pending',
                'type' => $fields['type'],
            ]);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $filename = uniqid() . '_' . $file->getClientOriginalName();
                    $directory = 'images/posts';

                    $storedPath = $file->storeAs($directory, $filename, 'sftp');

                    if (!$storedPath) {
                        throw new \Exception("Échec du téléchargement de l’image : " . $filename);
                    }

                    PostImage::create([
                        'post_id' => $post->id,
                        'image_path' => $storedPath,
                    ]);
                }
            }

            $post->load(['images', 'user']);

            DB::commit();

            return response()->json([
                'message' => 'Publication créée avec succès',
                'post' => $post,
                'success' => true,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Échec de validation des données.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Une erreur est survenue.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



    public function updatePost(Request $request, $id)
    {

        $content = $request->validate([
            'content' => 'required',
        ], [
            'content.required' => 'Le content est requis.',
        ]);


        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post introuvable.'], 404);
        }

        $post->content = $content['content'];
        $post->save();


        return response()->json([
            'message' => "Post mis à jour.",
            'data' => $post
        ]);
    }

    public function approvedPost(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:published,refused',
        ], [
            'status.required' => 'Le statut est requis.',
            'status.in' => 'Le statut doit être published ou refused.',
        ]);


        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Demande introuvable.'], 404);
        }

        $post->status = $request->status;
        $post->save();
        $user = $post->user;
        if ($user) {
            $user->notify(new PostStatusUpdated($request->status, $post));
        }

        return response()->json([
            'message' => "Post publié.",
            'data' => $post
        ]);
    }

    public function getOnePost($id)
    {
        $post = Post::where('id', $id)
            ->first();

        return $post;
    }

    public function getAllPostsPublished()
    {
        $posts = Post::with(['images', 'user'])
            ->where('status', 'published')
            ->where('type', 'public')
            ->orderBy('created_at', 'desc')
            ->get();

        $formattedPosts = $posts->map(function ($post) {
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

        return response()->json($formattedPosts);
    }


    public function getAllPostsPending()
    {
        $posts = Post::with(['images', 'user'])
            ->where('status', 'pending')
            ->where('type', 'public')
            ->orderBy('created_at', 'desc')->get();

        $formattedPosts = $posts->map(function ($post) {
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

        return response()->json($formattedPosts);
    }

    public function refusePost($id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post non trouvé'], 404);
        }

        $post->delete();

        return response()->json(['message' => 'Post refusé'], 200);
    }


    public function getUserPosts($userId)
    {
        $posts = Post::with('images')
            ->where('user_id', $userId)
            ->where('status', 'published')
            ->get();

        return response()->json($posts);
    }

    public function reactToPost(Request $request, $postId)
    {
        $request->validate([
            'user_id' => 'required',
            'type' => 'required',
        ]);

        $user_id = $request->user_id;

        $reaction = Reaction::updateOrCreate(
            ['user_id' => $user_id, 'post_id' => $postId],
            ['type' => $request->type]
        );

        return response()->json([
            'message' => 'Réaction enregistrée',
            'reaction' => $reaction
        ]);
    }

    public function getReact($id)
    {
        return Reaction::where('post_id', $id)
            ->where('type', 'like')
            ->get();
    }

    public function commentToPost(Request $request, $postId)
    {
        $request->validate([
            'user_id' => 'required',
            'content' => 'required',
        ]);

        $comment = Comment::create([
            'user_id' => $request->user_id,
            'post_id' => $postId,
            'content' => $request->content,
        ]);

        $comment->load('user');

        broadcast(new NewCommentPosted($comment));

        return response()->json([
            'message' => 'Commentaire ajouté',
            'comment' => $comment,
        ]);
    }

    public function getCommentCount($id)
    {
        return Comment::where('post_id', $id)
            ->count();
    }

    public function getComment($id)
    {
        $comments = Comment::with('user.userDetail')
            ->where('post_id', $id)
            ->get();

        return $comments;
    }

    public function getOneComment($id)
    {
        $comment = Comment::where('id', $id)
            ->first();

        return $comment;
    }

    public function updateComment(Request $request, $id)
    {
        $request->validate([
            'content' => 'required',
        ], [
            'content.required' => 'Le statut est requis.',
        ]);

        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['message' => 'Commentaire introuvable.'], 404);
        }

        $comment->content = $request->content;
        $comment->save();


        return response()->json([
            'message' => "Commentaire mis à jour.",
            'data' => $comment
        ]);
    }

    public function destroyComment($id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['message' => 'Commentaire non trouvé'], 404);
        }

        $comment->delete();

        return response()->json(['message' => 'Commentaire supprimé'], 200);
    }
}
