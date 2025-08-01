<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\DB;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
Broadcast::channel('group.{groupId}', function ($user, $groupId) {
    return DB::table('intranet_extedim.group_user')
        ->where('group_id', $groupId)
        ->where('user_id', $user->id)
        ->exists();
});
