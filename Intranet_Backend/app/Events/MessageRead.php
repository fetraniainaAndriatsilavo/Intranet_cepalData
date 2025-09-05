<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class MessageRead implements ShouldBroadcast
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

        if (!empty($this->message->conversation_id)) {
            $channels[] = new Channel('conversation.' . $this->message->conversation_id);
        }

        if (!empty($this->message->group_id)) {
            $channels[] = new Channel('group.' . $this->message->group_id);
        }

        if (!empty($this->message->receiver_id)) {
            $channels[] = new Channel('chat.' . $this->message->receiver_id);
        }

        if (empty($channels)) {
            $channels[] = new Channel('chat.global');
        }

        return $channels;
    }

    public function broadcastWith(): array
    {
        return [
            'id'          => $this->message->id,
            'read_at'     => $this->message->read_at ? $this->message->read_at->toDateTimeString() : null,
            'receiver_id' => $this->message->receiver_id,
        ];
    }

    public function broadcastAs(): string
    {
        return 'message.read';
    }

    public function broadcastWhen()
    {
        return true;
    }
}
