<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupPost extends Model
{
    use HasFactory;

    protected $connection = 'intranet_extedim';

    protected $table = 'posts_groups';


    protected $fillable = [
        'name',
        'created_by',
        'updated_by',
    ];

    /**
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     */
    public function members()
    {
        return $this->belongsToMany(User::class, 'posts_groups_users', 'group_id', 'user_id')
            ->withTimestamps()
            ->withPivot('joined_at', 'role');
    }

    /**
     */
    public function posts()
    {
        return $this->hasMany(Post::class, 'group_id');
    }
}
