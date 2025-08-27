<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CommentNotification extends Notification
{
    use Queueable;

    protected $comment;
    protected $post;

    public function __construct($comment, $post)
    {
        $this->comment = $comment;
        $this->post = $post;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        if ($notifiable->id === $this->post->user_id) {
            $message = "{$this->comment->user->first_name} a commenté votre publication, ({$this->comment->content})";
        } else {
            $message = "{$this->comment->user->first_name} a commenté la publication de {$this->post->user->first_name}, ({$this->comment->content})";
        }

        return [
            'message' => $message,
            'comment_content' => $this->comment->content,
            'post_id' => $this->post->id,
            'comment_id' => $this->comment->id,
        ];
    }
}
