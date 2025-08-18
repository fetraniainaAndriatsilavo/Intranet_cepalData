<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TimesheetPeriodClosed extends Notification
{
    use Queueable;

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Clôture des feuilles de temps')
            ->line("Bonjour {$notifiable->first_name},")
            ->line("Veuillez valider les feuilles de temps de votre équipe car la session est maintenant fermée.")
            ->line("Merci de votre collaboration.");
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => "Veuillez valider les feuilles de temps de votre équipe car la session est fermée.",
        ];
    }
}
