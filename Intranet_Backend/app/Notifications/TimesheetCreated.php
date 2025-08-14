<?php

namespace App\Notifications;

use App\Models\Timesheet;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\DatabaseMessage;

class TimesheetCreated extends Notification
{
    use Queueable;

    protected $user;
    protected $affectedRows;

    /**
     * Create a new notification instance.
     *
     * @param  \App\Models\User  $user
     * @param  int  $affectedRows
     * @return void
     */
    public function __construct($user, $affectedRows)
    {
        $this->user = $user;
        $this->affectedRows = $affectedRows;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        // Par exemple mail et base de données
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Mise à jour des feuilles de temps')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line("Les feuilles de temps de l'utilisateur {$this->user->name} ont été mises à jour.")
            ->line("Nombre de feuilles de temps envoyées : {$this->affectedRows}.")
            ->salutation('Cordialement,')
            ->salutation(config('app.name'));
    }

    /**
     * Stocker la notification dans la base de données (si activé).
     */
    public function toDatabase($notifiable)
    {
        return [
            'user_id' => $this->user->id,
            'user_name' => $this->user->name,
            'affected_rows' => $this->affectedRows,
            'message' => "Les feuilles de temps ont été mises à jour en 'sent'."
        ];
    }
}
