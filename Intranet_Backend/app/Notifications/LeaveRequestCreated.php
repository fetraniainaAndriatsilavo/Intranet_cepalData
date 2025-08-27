<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class LeaveRequestCreated extends Notification
{
    public $leaveRequest;

    public function __construct($leaveRequest)
    {
        $this->leaveRequest = $leaveRequest;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Nouvelle demande de congé')
            ->greeting('Bonjour ' . $notifiable->first_name)
            ->line('Une nouvelle demande de congé a été soumise par ' . $this->leaveRequest->user->first_name . '.')
            ->line('Période : ' . $this->leaveRequest->start_date . ' au ' . $this->leaveRequest->end_date)
            ->line('Veuillez voir la demande de votre équipe')
            ->line('Merci de votre attention.');
    }
    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Nouvelle demande de congé',
            'message' => $this->leaveRequest->user->first_name . ' a soumis une demande du ' .
                $this->leaveRequest->start_date . ' au ' . $this->leaveRequest->end_date,
            'action_url' => 'http://localhost:3000/leaves/' . $this->leaveRequest->id,
        ];
    }
}
