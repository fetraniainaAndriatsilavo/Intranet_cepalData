<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OgcHoliday extends Model
{
    protected $table = 'intranet_extedim.ogc_holidays';

    protected $fillable = [
        'date',
        'name',
        'comment',
        'is_recurring',
        'updated_at',
        'updated_by',
        'gender',
    ];

    public $timestamps = false;
    protected $casts = [
        'date' => 'date',
        'is_recurring' => 'boolean',
    ];
}
