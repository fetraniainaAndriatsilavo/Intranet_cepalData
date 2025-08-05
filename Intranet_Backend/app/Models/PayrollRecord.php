<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayrollRecord extends Model
{
    use HasFactory;

    protected $connection = 'pgsql';
    protected $table = 'intranet_extedim.payroll_records'; 

    protected $fillable = [
        'employee_id',
        'period',
        'file_url',
        'uploaded_by',
        'status',
    ];

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
