<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class ChatMessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $broadcastQueue = null;

    public $message;
    public $receiver;
    public $sender;

    public function __construct($message, $receiver, $sender)
    {
        $this->message = $message;
        $this->receiver = $receiver;
        $this->sender = $sender;
    }

    public function broadcastOn()
    {
        return [
            new Channel('chat.' . $this->message->receiver_id),
            new Channel('chat.' . $this->message->sender_id),
        ];
    }


    public function broadcastAs()
    {
        return 'message.sent';
    }

    public function broadcastWhen()
    {
        return true;
    }
}
