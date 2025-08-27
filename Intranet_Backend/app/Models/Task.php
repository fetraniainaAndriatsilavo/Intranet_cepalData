<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $connection = 'intranet_extedim';

    protected $table = 'tasks';



    protected $fillable = [
        'title',
        'description',
        'project_id',
        'task_parent_id',
        'start_date',
        'due_date',
        'priority',
        'sprint_id',
        'status',
        'time',
        'type',
        'updated_by',
        'user_allocated_id',
        'updated_at',
        'created_at'
    ];


    public $incrementing = true;
    protected $keyType = 'int';


    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'user_allocated_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function sprint()
    {
        return $this->belongsTo(Sprint::class, 'sprint_id');
    }

    public function parentTask()
    {
        return $this->belongsTo(Task::class, 'task_parent_id');
    }
}
