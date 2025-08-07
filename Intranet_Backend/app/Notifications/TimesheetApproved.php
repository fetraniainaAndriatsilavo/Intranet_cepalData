<?php
namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class TimesheetApproved extends Notification
{
    public $timesheet;

    public function __construct($timesheet)
    {
        $this->timesheet = $timesheet;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('✅ Feuille de temps approuvée')
            ->greeting('Bonjour ' . $notifiable->first_name . ',')
            ->line('Votre feuille de temps du ' . $this->timesheet->date->format('d/m/Y') . ' a été approuvée.')
            ->action('Voir votre feuille de temps', url('/timesheets/' . $this->timesheet->id))
            ->line('Merci pour votre travail.');
    }

    public function toDatabase($notifiable)
    {
        return [
            'timesheet_id' => $this->timesheet->id,
            'message' => 'Votre feuille de temps du ' . $this->timesheet->date->format('d/m/Y') . ' a été approuvée.',
            'url' => url('/timesheets/' . $this->timesheet->id)
        ];
    }

    public function toArray($notifiable)
    {
        return [
            'timesheet_id' => $this->timesheet->id,
            'message' => 'Feuille de temps approuvée.',
        ];
    }
}
