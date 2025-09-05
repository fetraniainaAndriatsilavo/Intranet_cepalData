<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class GroupMessageSent implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;
    public $broadcastQueue = null;

    public $message;

    public function __construct(Message $message)
    {
        $this->message = $message->load('sender');
    }

    public function broadcastOn()
    {
        return new Channel('group.' . $this->message->group_id);
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->message->id,
            'group_id' => $this->message->group_id,
            'sender_id' => $this->message->sender_id,
            'sender_name' => $this->message->sender->name ?? 'Inconnu',
            'content' => $this->message->content,
            'created_at' => $this->message->created_at->toDateTimeString(),
        ];
    }

    public function broadcastAs()
    {
        return 'new.group.message';
    }

    public function broadcastWhen()
    {
        return true;
    }
}
