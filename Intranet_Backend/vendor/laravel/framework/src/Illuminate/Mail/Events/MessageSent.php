<?php

namespace Illuminate\Mail\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Queue\ShouldQueue;

class MessageSent implements ShouldBroadcast, ShouldQueue
{
    public $message;
    public $receiver_id;
    public $sender_id;

    public function __construct($message, array $data)
    {
        $this->message = $message;
        $this->receiver_id = $data['receiver_id'] ?? null;
        $this->sender_id = $data['sender_id'] ?? null;
    }


    public function broadcastOn()
    {
        return new Channel('chat.' . $this->receiver_id);
    }

    public function broadcastWith()
    {
        return [
            'message' => $this->message,
            'sender_id' => $this->sender_id,
        ];
    }
}
