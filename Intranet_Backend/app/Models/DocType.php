<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocType extends Model
{
    use HasFactory;

    protected $connection = 'pgsql';
    protected $table = 'intranet_extedim.documents_type';

    protected $fillable = [
        'name',
        'uploaded_by',
        'uploaded_at',
        'description',
    ];
}
