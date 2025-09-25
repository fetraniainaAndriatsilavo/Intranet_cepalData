<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Messages\MailMessage;

class LeaveRequestCanceledByUser extends Notification
{
    protected $leaveRequest;
    protected $user;

    public function __construct($leaveRequest, $user)
    {
        $this->leaveRequest = $leaveRequest;
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Annulation de congé par un utilisateur')
            ->view('emails.leave_canceled', [
                'leaveRequest' => $this->leaveRequest,
                'user' => $this->user,
                'comment' => $this->leaveRequest->approved_comment ?? null,
                'notifiable' => $notifiable
            ]);
    }


    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Annulation de congé par un utilisateur',
            'message' => "{$this->user->name} a annulé sa demande de congé du {$this->leaveRequest->start_date} au {$this->leaveRequest->end_date}.",
            'request_id' => $this->leaveRequest->id,
            'user_id' => $this->user->id,
        ];
    }
}
