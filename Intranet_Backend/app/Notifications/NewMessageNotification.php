<?php

namespace App\Notifications;

use App\Models\Message;
use App\Models\MessageGroup;
use Illuminate\Broadcasting\Channel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;


class NewMessageNotification extends Notification implements ShouldBroadcast
{
    use Queueable;

    private $message;
    private $text;

    public function __construct(Message $message)
    {
        $this->message = $message->load('sender');

        if ($message->group_id) {
            $groupName = MessageGroup::find($message->group_id)?->name ?? 'un groupe';
            $this->text = "{$this->message->sender->first_name} a envoyé un message dans le groupe {$groupName} : {$this->message->content}";
        } else {
            $this->text = "{$this->message->sender->first_name} a envoyé un message : {$this->message->content}";
        }
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast', 'mail'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'conversation_id' => $this->message->conversation_id,
            'group_id'        => $this->message->group_id,
            'sender_id'       => $this->message->sender_id,
            'sender_name'     => $this->message->sender->first_name,
            'content'         => $this->text,
            'created_at'      => $this->message->created_at,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'conversation_id' => $this->message->conversation_id,
            'group_id'        => $this->message->group_id,
            'sender_id'       => $this->message->sender_id,
            'sender_name'     => $this->message->sender->first_name,
            'content'         => $this->text,
            'created_at'      => $this->message->created_at,
        ]);
    }

    public function broadcastOn()
    {
        return new Channel('public-messages');
    }
}
