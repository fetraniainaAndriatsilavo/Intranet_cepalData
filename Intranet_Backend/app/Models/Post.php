<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $connection = 'intranet_extedim';
    protected $table = "posts";

    protected $fillable = [
        'user_id',
        'content',
        'image',
        'group_id',
        'type',
    ];

    public function images()
    {
        return $this->hasMany(PostImage::class, 'post_id');
    }
    public function videos()
    {
        return $this->hasMany(PostVideo::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function reactions()
    {
        return $this->hasMany(Reaction::class);
    }
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function group()
    {
        return $this->belongsTo(GroupPost::class, 'group_id');
    }
}
