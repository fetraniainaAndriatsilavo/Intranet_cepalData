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
        return [
            new Channel('chat.' . $this->message->sender_id),
            new Channel('chat.' . $this->message->receiver_id),
        ];
    }


    public function broadcastWith(): array
    {
        return [
            'id' => $this->message->id,
            'sender_id' => $this->message->sender_id,
            'receiver_id' => $this->message->receiver_id,
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
