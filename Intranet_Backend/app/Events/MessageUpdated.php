<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class MessageUpdated implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;
    public $broadcastQueue = null;

    public $message;

    public function __construct(Message $message)
    {
        $message->refresh();

        $this->message = $message;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('chat.' . $this->message->sender_id),
            new Channel('chat.' . $this->message->receiver_id),

        ];
    }

    // public function broadcastOn(): Channel
    // {
    //     $ids = [$this->message->sender_id, $this->message->receiver_id];
    //     sort($ids);
    //     return new Channel("chat.{$ids[0]}.{$ids[1]}");
    // }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->message->id,
            'sender_id' => $this->message->sender_id,
            'receiver_id' => $this->message->receiver_id,
            'content' => $this->message->content,
            'created_at' => $this->message->created_at,
            'updated_at' => $this->message->updated_at,
            'deleted' => $this->message->trashed(),
        ];
    }

    public function broadcastAs(): string
    {
        return 'message.updated';
    }

    public function broadcastWhen()
    {
        return true;
    }
}
