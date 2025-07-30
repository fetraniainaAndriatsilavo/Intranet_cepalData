<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LeaveRequest extends Model
{
    use HasFactory;

    protected $connection = 'intranet_extedim';

    protected $table = "leave_requests";

    protected $fillable = [
        'user_id',
        'request_type',
        'reason',
        'start_date',
        'end_date',
        'start_half_day',
        'end_half_day',
        'number_day',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    } 

    public function userDetails()
    {
        return $this->hasOneThrough(UserDetails::class, User::class, 'id', 'user_id');
    } 
    
}
