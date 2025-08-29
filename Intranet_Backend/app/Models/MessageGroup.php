<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageGroup extends Model
{
    protected $table = 'intranet_extedim.messages_groups';

    protected $fillable = ['name', 'updated_by'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'intranet_extedim.messages_groups_users', 'group_id', 'user_id')
            ->withPivot('is_admin');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'group_id', 'id');
    }
}
