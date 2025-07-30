<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostImage extends Model
{
    protected $connection = 'intranet_extedim';
    protected $table = "post_images";

    protected $fillable = [
        'post_id',
        'image_path',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id'); 
    }
    public function getUrlAttribute()
    {
        return 'https://youduwk.cluster029.hosting.ovh.net/post_images/' . basename($this->image_path);
    }
    public function images()
    {
        return $this->hasMany(PostImage::class);
    }
}
