<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewGroupMessageAdded extends Notification
{
    use Queueable;

    use Queueable;

    protected $group;
    protected $admin;

    public function __construct($group, $admin)
    {
        $this->group = $group;
        $this->admin = $admin;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $members = $this->group->users->pluck('first_name')->join(', ');

        return (new MailMessage)
            ->subject('Vous avez été ajouté à un groupe de discussion')
            ->greeting("Bonjour {$notifiable->first_name},")
            ->line("Vous avez été ajouté au groupe de discussion : {$this->group->name}")
            ->line("Membre(s) : $members")
            ->line("Admin : {$this->admin->first_name}")
            ->line('Merci d’utiliser notre application !');
    }

    public function toDatabase($notifiable)
    {
        $members = $this->group->users->pluck('first_name')->join(', ');

        return [
            'group_id' => $this->group->id,
            'group_name' => $this->group->name,
            'admin_name' => $this->admin->first_name,
            'members' => $members,
            'message' => "{$this->admin->first_name} vous a ajouté au groupe {$this->group->name}",
        ];
    }
}
