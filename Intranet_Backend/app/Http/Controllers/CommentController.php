<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use App\Notifications\CommentNotification;
use Illuminate\Http\Request;

class CommentController extends Controller
{

    public function index($postId)
    {
        $comments = Comment::where('post_id', $postId)
            ->with('user')
            ->latest()
            ->get();

        return response()->json($comments);
    }

    public function getInfoComment($commentId)
    {
        $comment = Comment::where('id', $commentId)
            ->with('user')
            ->get();

        return response()->json($comment);
    }

    public function store(Request $request, $postId)
    {

        $request->validate([
            'user_id' => 'required|exists:intranet_extedim.users,id',
            'content' => 'required|string',
        ]);

        $post = Post::with([
            'attachments',
            'user',
        ])
            ->published()
            ->withTrashed()
            ->findOrFail($postId);

        $comment = Comment::create([
            'user_id' => $request->user_id,
            'post_id' => $post->id,
            'content' => $request->input('content'),
        ]);

        $post->increment('comment_count');

        if ($post->user_id != $comment->user_id) {
            $post->user->notify(new CommentNotification($comment, $post));
        }

        return response()->json($comment, 201);
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment = Comment::findOrFail($id);

        $comment->update([
            'content' => $request->input('content'),
        ]);



        return response()->json($comment);
    }

    public function destroy($id)
    {
        $comment = Comment::with('post')->findOrFail($id);

        if ($comment->post) {
            $comment->post->decrement('comment_count');
        }

        $comment->delete();

        return response()->json(['message' => 'Commentaire supprimé']);
    }
}
