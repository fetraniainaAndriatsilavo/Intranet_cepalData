<?php

namespace App\Notifications;

use App\Models\Timesheet;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\DatabaseMessage;

class TimesheetCreated extends Notification
{

    public $timesheet;

    public function __construct(Timesheet $timesheet)
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
            ->subject('🕒 Feuille de temps soumise')
            ->greeting('Bonjour ' . $notifiable->first_name . ',')
            ->line('📄 Une nouvelle feuille de temps a été soumise.')
            ->line('👤 Utilisateur : **' . $this->timesheet->user->first_name . '**')
            ->line('📅 Date : **' . $this->timesheet->date->format('d/m/Y') . '**')
            ->line('🗓️ Période : **' . ($this->timesheet->timesheetPeriod->periode ?? 'Inconnue') . '**')
            ->action(' Voir la feuille de temps', url('/timesheets/' . $this->timesheet->id))
            ->line('Merci de votre attention.');
    }


    public function toDatabase($notifiable)
    {
        return [
            'timesheet_id' => $this->timesheet->id,
            'user_id' => $this->timesheet->user->id,
            'periode' => $this->timesheet->timesheetPeriod->periode ?? null,
            'message' => 'Une nouvelle feuille de temps a été soumise par ' . $this->timesheet->user->name,
            'url' => url('/timesheets/' . $this->timesheet->id)
        ];
    }


    public function toArray($notifiable)
    {
        return [
            'timesheet_id' => $this->timesheet->id,
            'periode' => $this->timesheet->timesheetPeriod->periode ?? null,
            'message' => 'Une nouvelle feuille de temps a été soumise.',
        ];
    }
}
