<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $connection = 'intranet_extedim';
    protected $table = 'departments';
    protected $fillable = [
        'name',
        'description',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
