<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = 'intranet_extedim.events';

    protected $fillable = [
        'title',
        'description',
        'date',
    ];

    protected $casts = [
        'date' => 'datetime',
    ];
}
