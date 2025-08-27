<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $connection = 'intranet_extedim';
    protected $table = 'projects';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'project_lead_id',
        'type',
        'client_code',
        'updated_by',
        'is_it',
        'status',
    ];
    protected $attributes = [
        'is_it' => true,
    ];


    public function sprints()
    {
        return $this->hasMany(Sprint::class, 'project_id', 'project_id');
    }
    public function tasks()
    {
        return $this->hasMany(Task::class, 'project_id');
    }
}
