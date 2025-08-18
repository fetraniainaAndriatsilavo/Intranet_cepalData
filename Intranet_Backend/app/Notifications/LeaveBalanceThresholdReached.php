<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LeaveBalanceThresholdReached extends Notification implements ShouldQueue
{
    use Queueable;

    protected $threshold;

    public function __construct($threshold)
    {
        $this->threshold = $threshold;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Alerte Congés')
            ->line("Bonjour {$notifiable->first_name},")
            ->line("Votre solde de congés a atteint **{$this->threshold} jours**.")
            ->line("Veuillez planifier un congé.");
    }

    public function toDatabase($notifiable)
    {
        return [
            'message'   => "Votre solde de congés a atteint {$this->threshold} jours. Veuillez planifier un congé.",
            'threshold' => $this->threshold,
        ];
    }
}
