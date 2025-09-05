<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class NewGroupPostAdded extends Notification
{
    use Queueable;

    protected $group;
    protected $creator;

    public function __construct($group, $creator)
    {
        $this->group = $group;
        $this->creator = $creator;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $members = $this->group->members->pluck('first_name')->join(', ');

        return (new MailMessage)
            ->subject('Vous avez été ajouté à un groupe de publication')
            ->greeting("Bonjour {$notifiable->first_name},")
            ->line("Vous avez été ajouté au groupe : {$this->group->name}")
            ->line("Membres : $members")
            ->line("Créé par : {$this->creator->first_name}")
            ->line('Merci d’utiliser notre application !');
    }

    public function toDatabase($notifiable)
    {
        $members = $this->group->members->pluck('first_name')->join(', ');

        return [
            'group_id' => $this->group->id,
            'group_name' => $this->group->name,
            'creator_name' => $this->creator->first_name,
            'members' => $members,
            'message' => "{$this->creator->first_name} vous a ajouté au groupe {$this->group->name}",
        ];
    }
}
