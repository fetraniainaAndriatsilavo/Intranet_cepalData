<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the broadcast channels that your application
| supports. The given channel authorization callbacks are used to check
| if an authenticated user can listen to the channel.
|
*/

Broadcast::routes(['middleware' => ['api']]); // Add api middleware if needed
 
Broadcast::channel('chat.{userId}', function ($user, $userId) {
    // Authenticate the user who has access to this channel
    return (int) $user->id === (int) $userId;
}); 
