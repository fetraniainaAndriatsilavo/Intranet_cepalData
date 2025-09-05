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
            ->subject('Votre compte a été créé')
            ->greeting('Bonjour ' . $notifiable->first_name . ',')
            ->line('Votre compte a été créé par un responsable sur la plateforme intranet.')
            ->line('Votre mot de passe temporaire est : **' . $this->defaultPassword . '**')
            ->line('Merci de le changer dès maintenant pour des raisons de sécurité.')
            ->action('Changer mon mot de passe', 'http://intranet.ext.local:8080/settings')
            ->line('Merci de votre collaboration.');
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Bienvenue ' . $notifiable->first_name,
            'message' => 'Votre compte a été créé avec succès. Email: ' . $notifiable->email . 'Votre mot de    passe temporaire est : **' . $this->defaultPassword . '**',
            'action_url' => 'http://intranet.ext.local:8080',
            'schema' => 'intranet_extedim',
        ];
    }
}
