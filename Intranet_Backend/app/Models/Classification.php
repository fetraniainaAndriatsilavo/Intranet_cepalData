<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classification extends Model
{
    protected $connection = 'intranet_extedim';
    protected $table = 'classifications';

    protected $fillable = [
        'group_name',
        'categ_name',
        'description',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
