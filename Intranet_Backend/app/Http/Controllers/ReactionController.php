<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Reaction;
use App\Notifications\ReactionNotification;
use Illuminate\Http\Request;

class ReactionController extends Controller
{
    public function getReaction($postId)
    {

        $reaction = Reaction::where('post_id', $postId)->with('user')->get();

        return response()->json($reaction);
    }


    public function react(Request $request, $postId)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|string|in:like,dislike',
        ]);

        $post = Post::with([
            'attachments',
            'user',
        ])
            ->published()
            ->withTrashed()
            ->findOrFail($postId);

        if ($request->type === 'like') {
            Reaction::firstOrCreate([
                'user_id' => $request->user_id,
                'post_id' => $post->id,
            ], [
                'type' => 'like'
            ]);
        } else {
            Reaction::where('user_id', $request->user_id)
                ->where('post_id', $post->id)
                ->delete();
        }

        $post->likes_count = $post->reactions()->count();
        $post->save();

        return response()->json([
            'message' => $request->type === 'like' ? 'Like ajouté' : 'Like retiré',
            'likes_count' => $post->likes_count
        ]);
    }

    public function removeReaction($postId, $userId)
    {
        $reaction = Reaction::where('post_id', $postId)
            ->where('user_id', $userId)
            ->firstOrFail();

        $reaction->delete();

        $post = Post::find($postId);
        $post->likes_count = $post->reactions()->count();
        $post->save();

        return response()->json(['message' => 'Reaction supprimée']);
    }
}
