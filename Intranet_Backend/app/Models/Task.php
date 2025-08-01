<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $connection = 'intranet_extedim';

    protected $table = 'task_management';

    protected $primaryKey = 'task_id';

    protected $fillable = [
        'title',
        'description',
        'project_id',
        'type',
        'parent_id',
        'status',
        'due_date',
        'sprint_id',
        'time',
    ];


    public $incrementing = true;
    protected $keyType = 'int';


    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function parentTask()
    {
        return $this->belongsTo(Task::class, 'parent_task_id');
    }

    public function subtasks()
    {
        return $this->hasMany(Task::class, 'parent_task_id');
    }
}
