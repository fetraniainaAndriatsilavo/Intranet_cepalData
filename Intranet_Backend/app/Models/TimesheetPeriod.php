<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimesheetPeriod extends Model
{
    protected $connection = 'intranet_extedim';
    protected $table = 'timesheets_periods';
    public $timestamps = false;

    protected $fillable = [
        'periode',
        'start_date',
        'end_date',
        'status',
        'updated_by',
        'created_at'
    ];

    public function timesheet()
    {
        return $this->hasMany(Timesheet::class, 'ts_period_id');
    }
}
