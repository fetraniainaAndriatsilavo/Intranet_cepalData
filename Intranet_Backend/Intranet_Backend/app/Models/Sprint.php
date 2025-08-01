<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sprint extends Model
{
    protected $connection = 'intranet_extedim';
    protected $table = 'sprints'; 
    protected $primaryKey = 'id_sprint'; 

    public $timestamps = true; 
    protected $fillable = [
        'id_sprint',
        'id_projet',
        'nom_sprint',
        'date_debut',
        'date_fin',
        'statut',
    ];

    public function projet()
    {
        return $this->belongsTo(Project::class, 'id_projet', 'project_id');
    }
   public function taches()
    {
        return $this->hasMany(Task::class, 'sprint_id', 'id_sprint');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'task_id');
    }

}   
