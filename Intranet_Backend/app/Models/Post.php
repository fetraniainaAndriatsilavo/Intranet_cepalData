<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use SoftDeletes;
    protected $connection = 'intranet_extedim';
    protected $table = "posts";
    protected $fillable = [
        'user_id',
        'image',
        'content',
        'status',
        'likes_count',
        'comment_count',
        'group_id',
        'deleted_by',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
    public function attachments()
    {
        return $this->hasMany(PostAttachment::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
