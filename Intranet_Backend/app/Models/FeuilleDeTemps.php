<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FeuilleDeTemps extends Model
{
    use HasFactory;

    protected $connection = 'intranet_extedim';
    protected $table = 'feuilles_de_temps';

    protected $fillable = [
        'date',
        'heure',
        'client',
        'projet',
        'type',
        'description',
        'user_id',
        'status',
        'ft_periode_id',
    ];

    protected $casts = [
        'date' => 'date',
        'heure' => 'string',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ftPeriode()
    {
        return $this->belongsTo(FtPeriode::class, 'ft_periode_id');
    }
}
