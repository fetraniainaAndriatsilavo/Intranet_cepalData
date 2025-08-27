<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReactionNotification extends Notification
{
    use Queueable;
    use Queueable;

    protected $reaction;
    protected $post;

    public function __construct($reaction, $post)
    {
        $this->reaction = $reaction;
        $this->post = $post;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        $message = "{$this->post->first_name} a réagi votre publication, ({$this->post->content})";


        return [
            'message' => $message,
            'post_id' => $this->post->id,
        ];
    }
}
