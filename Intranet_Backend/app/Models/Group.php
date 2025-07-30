<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Group extends Model
{
    protected $connection = 'intranet_extedim';
    protected $fillable = ['name'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'intranet_extedim.group_user', 'group_id', 'user_id');
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}