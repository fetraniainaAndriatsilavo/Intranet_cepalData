<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewEventCreated extends Notification
{
    use Queueable;

    protected $event;

    public function __construct($event)
    {
        $this->event = $event;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'event_id'   => $this->event->id,
            'title'      => $this->event->title,
            'description' => $this->event->description,
            'date'       => $this->event->date->toDateTimeString(),
            'message'    => "{$this->event->title} aura lieu le {$this->event->date->format('d/m/Y H:i')}. Description : {$this->event->description}",
        ];
    }
}
