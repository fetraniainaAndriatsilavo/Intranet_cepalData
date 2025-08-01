<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LeaveRequest extends Model
{
    use HasFactory;

    protected $connection = 'intranet_extedim';

    protected $table = "ogc_leave_requests";

    protected $fillable = [
        'user_id',
        'reason',
        'start_date',
        'end_date',
        'start_half_day',
        'end_half_day',
        'number_day',
        'status',
        'approved_at',
        'approved_by',
        'approved_comment',
        'is_inserted_to_ogcumul',
        'reason',
        'leave_type_id',
        'support_file_path',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function leaveType()
    {
        return $this->belongsTo(LeaveType::class, 'leave_type_id');
    }
}
