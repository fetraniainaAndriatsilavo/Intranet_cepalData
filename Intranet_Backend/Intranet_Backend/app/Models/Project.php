<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $connection = 'intranet_extedim';
    protected $table = 'projects';
    protected $primaryKey = 'project_id';

    protected $fillable = [
        'project_id',
        'name',
        'description',
        'start_date',
        'project_lead_id',
        'type',
        'status',
    ];

    public function sprints()
    {
        return $this->hasMany(Sprint::class, 'id_projet', 'project_id');
    }
    public function tasks()
    {
        return $this->hasMany(Task::class, 'project_id');
    }
}
