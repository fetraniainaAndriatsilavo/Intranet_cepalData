<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AdminErrorReportNotification extends Notification
{
    use Queueable;

    protected $user;
    protected $errorsText;

    public function __construct($user, string $errorsText)
    {
        $this->user = $user;
        $this->errorsText = $errorsText;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'title' => "Erreur signalée",
            'message' => "{$this->user->first_name} {$this->user->last_name} a signalé une erreur : {$this->errorsText}",
            'user_id' => $this->user->id,
            'user_name' => $this->user->first_name,
        ];
    }
}
