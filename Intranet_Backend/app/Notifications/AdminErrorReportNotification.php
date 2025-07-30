<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AdminErrorReportNotification extends Notification
{
    use Queueable;

    protected $user;
    protected $errors;

    public function __construct($user, $errors)
    {
        $this->user = $user;
        $this->errors = $errors;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        $messages = [];

        foreach ($this->errors as $error) {
            $field = $error['field'];
            $messages[] = "{$this->user->name} a signalé une erreur dans le champ \"{$field}\".";
        }

        return [
            'messages' => $messages,
            'user_id' => $this->user->id,
            'user_name' => $this->user->name,

        ];
    }
}
