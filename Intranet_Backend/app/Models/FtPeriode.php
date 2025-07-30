<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FtPeriode extends Model
{
    protected $connection = 'intranet_extedim';
    protected $table = 'ft_periodes';

    protected $fillable = ['date', 'user_id', 'status'];

    protected $casts = [
        'date' => 'string',
    ];

    public function feuilles()
    {
        return $this->hasMany(FeuilleDeTemps::class, 'ft_periode_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
