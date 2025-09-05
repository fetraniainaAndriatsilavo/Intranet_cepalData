<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use App\Models\Message;

class UserMessageSent implements ShouldBroadcast
{
    use SerializesModels;

    public $message;

    public function __construct(Message $message)
    {
        $this->message = $message;
        $this->message = $message->load('sender');
    }

    public function broadcastOn()
    {
        if ($this->message->conversation_id) {
            return new Channel('conversation.' . $this->message->conversation_id);
        }

        if ($this->message->group_id) {
            return new Channel('group.' . $this->message->group_id);
        }

        return new Channel('chat.global');
    }

    public function broadcastWith()
    {
        if ($this->message->group_id) {
            return [
                'id'              => $this->message->id,
                'content'         => $this->message->content,
                'sender_id'       => $this->message->sender_id,
                'sender_name'       => $this->message->sender->first_name,
                'conversation_id' => $this->message->conversation_id,
                'group_id'        => $this->message->group_id,
                'created_at'      => $this->message->created_at->toDateTimeString(),
            ];
        }

        if ($this->message->conversation_id) {
            return [
                'id'              => $this->message->id,
                'content'         => $this->message->content,
                'sender_id'       => $this->message->sender_id,
                'conversation_id' => $this->message->conversation_id,
                'group_id'        => $this->message->group_id,
                'created_at'      => $this->message->created_at->toDateTimeString(),
                'sender' => [
                    'id'         => $this->message->sender->id,
                    'first_name' => $this->message->sender->first_name,
                    'last_name'  => $this->message->sender->last_name,
                    'email'      => $this->message->sender->email,
                ],
            ];
        }

        return [
            'id'          => $this->message->id,
            'content'     => $this->message->content,
            'sender_id'   => $this->message->sender_id,
            'created_at'  => $this->message->created_at->toDateTimeString(),
        ];
    }


    // public function broadcastWith()
    // {
    //     return [
    //         'id'             => $this->message->id,
    //         'content'        => $this->message->content,
    //         'status'        => $this->message->status,
    //         'sender_id'      => $this->message->sender_id,
    //         'conversation_id' => $this->message->conversation_id,
    //         'group_id'       => $this->message->group_id,
    //         'created_at'     => $this->message->created_at->toDateTimeString(),
    //         'sender' => [
    //             'id'         => $this->message->sender->id,
    //             'first_name' => $this->message->sender->first_name,
    //             'last_name'  => $this->message->sender->last_name,
    //             'email'      => $this->message->sender->email,
    //         ],
    //     ];
    // }

    public function broadcastAs()
    {
        return 'UserMessageSent';
    }
}
