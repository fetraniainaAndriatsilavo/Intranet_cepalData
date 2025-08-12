<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostAttachment extends Model
{
    protected $connection = 'intranet_extedim';
    protected $table = "posts_attachments";
    protected $fillable = [
        'post_id',
        'file_path',
        'is_image',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
