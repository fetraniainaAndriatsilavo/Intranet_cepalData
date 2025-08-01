<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PostStatusUpdated extends Notification
{
    use Queueable;

    public $status;
    public $post;

    public function __construct($status, $post)
    {
        $this->status = $status;
        $this->post = $post;
    }


    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'message' => $this->status === 'published'
                ? "Votre post (« {$this->post->content} ») a été publié."
                : "Votre post (« {$this->post->content} ») a été refusé.",
            'post_id' => $this->post->id,
            'content' => $this->post->content,
            'status' => $this->status
        ];
    }
}
