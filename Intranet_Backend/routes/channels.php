<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\DB;
use App\Models\Conversation;

Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});


Broadcast::channel('conversation.{conversationId}', function ($user, $conversationId) {
    return Conversation::where('id', $conversationId)
        ->where(function ($q) use ($user) {
            $q->where('user_one_id', $user->id)
                ->orWhere('user_two_id', $user->id);
        })
        ->exists();
});

Broadcast::channel('group.{groupId}', function ($user, $groupId) {
    return DB::table('intranet_extedim.group_user')
        ->where('group_id', $groupId)
        ->where('user_id', $user->id)
        ->exists();
});
