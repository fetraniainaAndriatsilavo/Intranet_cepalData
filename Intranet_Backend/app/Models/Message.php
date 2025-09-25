<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Message extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'intranet_extedim.messages';

    protected $casts = [
        'file_paths' => 'array',
        'read_at' => 'boolean',
    ];

    protected $fillable = [
        'sender_id',
        'receiver_id',
        'group_id',
        'content',
        'read_at',
        'conversation_id',
        'files_paths',
        'status',
    ];

    /**
     * L'expéditeur du message.
     */
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id')->select('id', 'first_name', 'last_name', 'email');
    }


    /**
     * Le destinataire du message.
     */
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    /**
     * La conversation à laquelle appartient le message.
     */
    // public function conversation()
    // {
    //     return $this->belongsTo(Conversation::class);
    // }
    public function conversation()
    {
        return $this->belongsTo(Conversation::class, 'conversation_id');
    }

    // public function group()
    // {
    //     return $this->belongsTo(Group::class);
    // }

    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function files()
    {
        return $this->hasMany(File::class,'message_id');
    }
}
