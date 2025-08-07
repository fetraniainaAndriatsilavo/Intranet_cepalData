<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Timesheet extends Model
{
    use HasFactory;

    protected $connection = 'intranet_extedim';
    protected $table = 'timesheets_details';

    protected $fillable = [
        'date',
        'nb_hour',
        'client_code',
        'project_id',
        'type',
        'description',
        'user_id',
        'status',
        'approved_by',
        'approved_at',
        'approved_comment',
        'ts_period_id',
        'ogc_leave_id',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function timesheetPeriod()
    {
        return $this->belongsTo(TimesheetPeriod::class, 'ts_period_id');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_code', 'code');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
}
