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
                'name' => 'required|string|max:255|unique:intranet_extedim.projects, name',
                'description' => 'nullable|string',
                'start_date' => 'required|date',
                'project_lead_id' => 'required|exists:intranet_extedim.users,id',
                'type' => 'nullable|string',
                'client_code' => 'nullable|string|max:100|exists:intranet_extedim.clients,code',
                'updated_by' => 'nullable|integer|exists:intranet_extedim.users,id',
                'status' => 'nullable|string|in:To-Do,Review,In-Progress,Deploy,Done',
            ], [
                'name.required' => 'Le nom du projet est obligatoire.',
                'name.string' => 'Le nom du projet doit être une chaîne de caractères.',
                'name.max' => 'Le nom du projet ne peut pas dépasser 255 caractères.',
                'name.unique' => 'Le nom du projet est déjà utilisé',

                'description.string' => 'La description doit être une chaîne de caractères.',

                'start_date.required' => 'La date de début est obligatoire.',
                'start_date.date' => 'La date de début doit être une date valide.',

                'project_lead_id.required' => 'Le chef de projet est obligatoire.',
                'project_lead_id.exists' => 'Le chef de projet sélectionné est invalide.',

                'type.string' => 'Le type de projet doit être une chaîne de caractères.',

                'client_code.string' => 'Le code client doit être une chaîne de caractères.',
                'client_code.max' => 'Le code client ne peut pas dépasser 100 caractères.',

                'updated_by.integer' => 'Le champ "mis à jour par" doit être un entier.',
                'updated_by.exists' => 'L’utilisateur ayant mis à jour le projet est invalide.',


                'status.string' => 'Le statut doit être une chaîne de caractères.',
                'status.max' => 'Le statut ne peut pas dépasser 50 caractères.',
            ]);
            $validated['is_it'] = true;
            $project = Project::create($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Projet créé avec succès.',
                'projet' => $project
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
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'status' => 'nullable|string|in:To-Do,Review,In-Progress,Deploy,Done',
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string',
        ], [
            'status.in' => 'Le statut doit être l\'un des suivants : "planned", "in_progress", "completed".',
            'name.string' => 'Le nom doit être une chaîne de caractères.',
            'name.max' => 'Le nom ne peut pas dépasser 255 caractères.',
            'description.string' => 'La description doit être une chaîne de caractères.',
            'type.string' => 'Le type doit être une chaîne de caractères.',
        ]);

        try {
            $project->update(array_filter($validated));

            return response()->json([
                'status' => 'success',
                'message' => 'Projet mis à jour avec succès.',
                'id_projet' => $project->id,
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
        return Project::where('id', $id)->first();
    }
}
