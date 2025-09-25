<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\DatabaseMessage;

class LeaveRequestStatusNotification extends Notification
{
    protected $leaveRequest;

    public function __construct($leaveRequest)
    {
        $this->leaveRequest = $leaveRequest;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Mise à jour de votre demande de congé')
            ->view('emails.leave_status', [
                'leaveRequest' => $this->leaveRequest,
                'user' => $notifiable
            ]);
    }

    public function toDatabase($notifiable)
    {
        $status = ucfirst($this->leaveRequest->status);

        $message = "Votre demande de congé du {$this->leaveRequest->start_date} au {$this->leaveRequest->end_date} a été {$status}.";

        if (!empty($this->leaveRequest->approved_comment)) {
            $message .= " Raison : {$this->leaveRequest->approved_comment}";
        }

        return [
            'title' => 'Mise à jour de votre demande de congé',
            'message' => $message,
            'request_id' => $this->leaveRequest->id,
            'status' => $this->leaveRequest->status,
            'approved_by' => $this->leaveRequest->approved_by,
            'approved_at' => $this->leaveRequest->approved_at,
        ];
    }
}
