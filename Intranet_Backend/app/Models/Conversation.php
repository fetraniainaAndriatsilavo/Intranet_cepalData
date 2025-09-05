<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Conversation extends Model
{
    use HasFactory;

    protected $table = 'intranet_extedim.conversations';

    protected $timestamp = false;
    protected $fillable = [
        'user_one_id',
        'user_two_id',
    ];

    /**
     * Relation avec les messages.
     */
    public function messages()
    {
        return $this->hasMany(Message::class, 'conversation_id')->orderBy('created_at', 'asc');
    }

    public function lastMessage()
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    /**
     * Récupère l'utilisateur 1 (initiateur).
     */
    public function userOne()
    {
        return $this->belongsTo(User::class, 'user_one_id');
    }

    /**
     * Récupère l'utilisateur 2 (interlocuteur).
     */
    public function userTwo()
    {
        return $this->belongsTo(User::class, 'user_two_id');
    }
}
