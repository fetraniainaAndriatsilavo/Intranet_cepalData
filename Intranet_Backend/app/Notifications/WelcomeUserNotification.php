<?php

namespace App\Notifications;

use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class WelcomeUserNotification extends Notification
{
    protected $defaultPassword;

    public function __construct(string $defaultPassword)
    {
        $this->defaultPassword = $defaultPassword;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Bienvenue sur l’intranet')
            ->view('emails.welcome-user', [
                'user' => $notifiable,
                'defaultPassword' => $this->defaultPassword,
                'intranetUrl' => config('app.url'),
            ]);
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Bienvenue ' . $notifiable->first_name,
            'message' => 'Votre compte a été créé avec succès. Email: '
                . $notifiable->email
                . ' Votre mot de passe temporaire est : **' . $this->defaultPassword . '**',
            'action_url' => config('app.url'),
            'schema' => 'intranet_extedim',
        ];
    }
}
