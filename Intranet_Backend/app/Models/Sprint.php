<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sprint extends Model
{
    protected $connection = 'intranet_extedim';
    protected $table = 'sprints';

    public $timestamps = true;
    protected $fillable = [
        'project_id',
        'title',
        'start_date',
        'due_date',
        'status',
        'description',
        'created_at',
        'updated_at',
        'updated_by',
    ];

    public function projet()
    {
        return $this->belongsTo(Project::class, 'project_id', 'id');
    }
    public function taches()
    {
        return $this->hasMany(Task::class, 'sprint_id', 'id');
    }
}
