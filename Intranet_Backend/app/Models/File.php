<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $table = 'intranet_extedim.messages_files';
    protected $timestamp = false;
    protected $fillable = [
        'message_id',
        'path',
        'original_name',
        'mime_type',
    ];

    public function message()
    {
        return $this->belongsTo(Message::class, 'message_id');
    }
}
