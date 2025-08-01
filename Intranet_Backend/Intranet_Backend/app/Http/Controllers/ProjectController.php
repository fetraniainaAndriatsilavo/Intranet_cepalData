<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use Illuminate\Support\Facades\Log;

class ProjectController extends Controller
{
    public function store(Request $request)
    {

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'start_date' => 'required|date',
                'project_lead_id' => 'required|exists:intranet_extedim.users,id',
                'type' => 'nullable|string',
                'status' => 'nullable',
            ], [
                'name.required' => 'Le nom du projet est obligatoire.',
                'name.string' => 'Le nom du projet doit être une chaîne de caractères.',
                'name.max' => 'Le nom du projet ne peut pas dépasser 255 caractères.',
                'description.string' => 'La description doit être une chaîne de caractères.',
                'start_date.required' => 'La date de début est obligatoire.',
                'start_date.date' => 'La date de début doit être une date valide.',
                'project_lead_id.required' => 'Le chef de projet est obligatoire.',
                'project_lead_id.exists' => 'Le chef de projet sélectionné est invalide.',
                'type.string' => 'Le type de projet doit être une chaîne de caractères.',
            ]);

            $project = Project::create($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Projet créé avec succès.',
                'id_projet' => $project->project_id
            ], 201);
        } catch (\Exception $e) {

            Log::error('Erreur lors de la création du projet : ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Une erreur est survenue.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function updateProject(Request $request, $id)
    {
        if (!$request->hasAny(['status', 'name'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Veuillez fournir au moins le statut ou le nom.',
            ], 422);
        }

        $validated = $request->validate([
            'status' => 'sometimes|required',
            'name' => 'sometimes|required|string|max:255',
        ], [
            'status.required' => 'Le statut est obligatoire si fourni.',
            'name.required' => 'Le nom du groupe est obligatoire si fourni.',
            'name.string' => 'Le nom doit être une chaîne de caractères.',
            'name.max' => 'Le nom ne doit pas dépasser 255 caractères.',
        ]);

        $project = Project::find($id);

        if (!$project) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tâche non trouvée.',
            ], 404);
        }

        try {
            if (isset($validated['status'])) {
                $project->status = $validated['status'];
            }

            if (isset($validated['name'])) {
                $project->name = $validated['name'];
            }

            $project->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Tâche mise à jour avec succès.',
                'id_tache' => $project->project_id,
                'statut' => $project->status,
                'nom' => $project->name,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Une erreur est survenue lors de la mise à jour.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getProjectByUserId($userId)
    {
        $userProject = Project::with('sprints')
            ->where('project_lead_id', $userId)
            ->get();

        if (!$userProject) {
            return response()->json([
                'message' => "Aucun projet trouvé pour l'utilisateur ID {$userId}."
            ], 404);
        }

        return response()->json([
            'message' => 'Projet récupéré avec succès.',
            'data' => $userProject->toArray(),
        ], 200);
    }

    public function destroy($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json([
                'status' => 'error',
                'message' => 'Projet non trouvé.',
            ], 404);
        }

        try {
            $project->tasks()->delete();   
            $project->sprints()->delete(); 

            $project->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Projet, ses tâches et ses sprints supprimés avec succès.',
                'id_projet_supprime' => $id,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Une erreur est survenue lors de la suppression.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function getProjectById($id)
    {
        return Project::where('project_id', $id)->first();
    }
}
