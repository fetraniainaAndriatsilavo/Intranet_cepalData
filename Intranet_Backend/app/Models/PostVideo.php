<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostVideo extends Model
{
    protected $connection = 'intranet_extedim';
    protected $table = "post_images";

    protected $fillable = [
        'post_id',
        'video_path',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id');
    }
    public function getUrlAttribute()
    {
        return 'https://youduwk.cluster029.hosting.ovh.net/post_videos/' . basename($this->video_path);
    }
    public function videos()
    {
        return $this->hasMany(PostVideo::class);
    }
}
