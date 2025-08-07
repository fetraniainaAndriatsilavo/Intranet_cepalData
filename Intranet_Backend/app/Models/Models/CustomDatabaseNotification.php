<?php

namespace App\Models;

use Illuminate\Notifications\DatabaseNotification;

class CustomDatabaseNotification extends DatabaseNotification
{
    protected $table = 'intranet_extedim.notifications';
}
