<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserDetails extends Model
{
    use HasFactory;


    protected $table = 'intranet_extedim.users_details';

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'job_title',
        'hire_date',
        'department',
        'birth_date',
        'birth_place',
        'employee_number',
        'cnaps_number',
        'phone_number',
        'address',
        'categorie',
        'manager_id',
        'dossier',
        'image'
    ];


    public $timestamps = true;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function managerUser()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class, 'dossier', 'dossier');
    }
}
