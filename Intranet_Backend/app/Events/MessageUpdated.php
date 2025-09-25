<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
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
        $channels = [];

        if (!empty($this->message->sender_id)) {
            $channels[] = new Channel('chat.' . $this->message->sender_id);
        }

        if (!empty($this->message->receiver_id)) {
            $channels[] = new Channel('chat.' . $this->message->receiver_id);
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
            'id'             => $this->message->id,
            'sender_id'      => $this->message->sender_id,
            'receiver_id'    => $this->message->receiver_id,
            'conversation_id' => $this->message->conversation_id,
            'group_id'       => $this->message->group_id,
            'content'        => $this->message->content,
            'created_at'     => $this->message->created_at->toDateTimeString(),
            'updated_at'     => $this->message->updated_at->toDateTimeString(),
            'deleted'        => $this->message->trashed(),
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
