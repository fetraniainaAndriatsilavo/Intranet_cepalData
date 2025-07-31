<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LeaveType extends Model
{
    use HasFactory;

    protected $connection = 'intranet_extedim';

    protected $table = "ogc_leave_types";

    protected $fillable = [
        'name',
        'description',
        'is_permission',
        'is_right',
        'is_other',
        'status',
        'nb_of_day',
        'updated_by',
        'wprking_days_only',
        'gender',
        'need_proof',
        'is_paied',
        'required_doct',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class, 'leave_type_id');
    }
}
