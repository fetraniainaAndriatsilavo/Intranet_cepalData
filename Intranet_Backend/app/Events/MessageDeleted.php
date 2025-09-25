<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class MessageDeleted implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $broadcastQueue = null;

    public $message;

    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    public function broadcastOn(): array
    {
        $channels = [];

        if (!empty($this->message->sender_id)) {
            $channels[] = new Channel('chat.' . $this->message->sender_id);
        }

        if (!empty($this->message->conversation_id)) {
            $channels[] = new Channel('conversation.' . $this->message->conversation_id);
        }

        if (!empty($this->message->group_id)) {
            $channels[] = new Channel('group.' . $this->message->group_id);
        }

        if (empty($channels)) {
            $channels[] = new Channel('chat.global');
        }

        return $channels;
    }




    public function broadcastWith(): array
    {
        return [
            'id' => $this->message->id,
            'sender_id' => $this->message->sender_id,
            'conversation_id' => $this->message->conversation_id,
            'deleted' => true,
        ];
    }

    public function broadcastAs(): string
    {
        return 'message.deleted';
    }
    public function broadcastWhen()
    {
        return true;
    }
}
