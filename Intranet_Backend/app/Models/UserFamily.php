<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserFamily extends Model
{
    use HasFactory;
    protected $connection = 'intranet_extedim';

    protected $table = 'users_family';


    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'relation',
        'gender',
        'birth_date',
        'is_legal',
        'updated_by',
    ];

    protected $dates = [
        'birth_date',
        'created_at',
        'updated_at',
    ];


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }


    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
