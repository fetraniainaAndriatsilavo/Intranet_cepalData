<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OgCumul extends Model
{
    use HasFactory;

    protected $connection = 'intranet_extedim';

    protected $table = 'ogc_cumul';

    protected $fillable = [
        'user_id',
        'leave_days',
        'permission_days',
        'other_days',
    ];

    protected $casts = [
        'leave_days' => 'float',
        'permission_days' => 'float',
        'other_days' => 'float',
    ];

    /**
     * Relation avec le modèle User
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
