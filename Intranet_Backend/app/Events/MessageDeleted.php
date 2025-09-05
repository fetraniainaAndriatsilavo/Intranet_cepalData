<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class MessageDeleted implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct(Message $message)
    {
        $this->message = $message->load('sender');
    }

    public function broadcastOn(): array
    {
        $channels = [];

        if ($this->message->conversation_id) {
            $channels[] = new Channel('conversation.' . $this->message->conversation_id);
        }

        if ($this->message->group_id) {
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
            'id'              => $this->message->id,
            'sender_id'       => $this->message->sender_id,
            'receiver_id'     => $this->message->receiver_id,
            'conversation_id' => $this->message->conversation_id,
            'group_id'        => $this->message->group_id,
            'deleted'         => true,
            'sender' => [
                'id'         => $this->message->sender->id ?? null,
                'first_name' => $this->message->sender->first_name ?? null,
                'last_name'  => $this->message->sender->last_name ?? null,
                'email'      => $this->message->sender->email ?? null,
            ],
        ];
    }

    public function broadcastAs(): string
    {
        return 'MessageDeleted';
    }
}
