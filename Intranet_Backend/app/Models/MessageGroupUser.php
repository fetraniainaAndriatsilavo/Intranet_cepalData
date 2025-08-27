<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageGroupUser extends Model
{
    protected $table = 'intranet_extedim.messages_groups_users';
    public $timestamps = false;
    protected $primaryKey = null;
    public $incrementing = false;
    protected $fillable = ['group_id', 'user_id', 'is_admin'];
}
