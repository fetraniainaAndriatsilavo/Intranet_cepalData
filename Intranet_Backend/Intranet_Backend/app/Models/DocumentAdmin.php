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
        'file_name',
        'doct_type_id',
        'file_path',
        'uploaded_by',
        'uploaded_at',
        'description',
        'is_public',
        'status',
        'period',
    ];

    public function userId()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function type()
    {
        return $this->belongsTo(DocType::class, 'doct_type_id');
    }
}
