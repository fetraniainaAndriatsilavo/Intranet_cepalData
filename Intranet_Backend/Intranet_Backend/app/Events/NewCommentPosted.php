<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NewCommentPosted implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $comment;
    public $broadcastQueue = null;


    public function __construct($comment)
    {
        $this->comment = $comment;
    }

    public function broadcastOn()
    {
        return new Channel('post.' . $this->comment->post_id);
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->comment->id,
            'content' => $this->comment->content,
            'user' => $this->comment->user,
        ];
    }

    public function broadcastAs()
    {
        return 'comment.sent';
    }

    public function broadcastWhen()
    {
        return true;
    }
}
