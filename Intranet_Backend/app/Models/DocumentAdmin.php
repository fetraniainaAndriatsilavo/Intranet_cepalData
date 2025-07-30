<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentAdmin extends Model
{
    use HasFactory;

    protected $connection = 'pgsql';
    protected $table = 'intranet_extedim.documents_admin'; 

    protected $fillable = [
        'user_id',
        'nom_document',
        'type_document',
        'fichier_url',
        'uploaded_by',
    ];

    public function userId()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
