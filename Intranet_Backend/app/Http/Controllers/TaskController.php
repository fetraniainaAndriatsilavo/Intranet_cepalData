<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    public function getTacheById($id)
    {
        return Task::where('task_id', $id)->first();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:intranet_extedim.users,id',
            'project_id' => 'required|exists:intranet_extedim.projects,project_id',
            'type' => 'required',
            'status' => 'required',
            'due_date' => 'nullable|date',
            'sprint_id' => 'nullable',
            'time' => 'nullable'

        ], [
            'title.required' => 'Le titre de la tâche est obligatoire.',
            'title.string' => 'Le titre doit être une chaîne de caractères.',
            'title.max' => 'Le titre ne peut pas dépasser 255 caractères.',

            'description.string' => 'La description doit être une chaîne de caractères.',

            'assigned_to.exists' => 'L’utilisateur assigné n’existe pas.',

            'project_id.required' => 'Le projet est obligatoire.',
            'project_id.exists' => 'Le projet spécifié est invalide.',

            'type.required' => 'Le type de tâche est obligatoire.',
            'type.in' => 'Le type de tâche doit être : main, sub, story ou bug.',

            'parent_task_id.exists' => 'La tâche parente spécifiée n’existe pas.',

            'status.required' => 'Le statut de la tâche est obligatoire.',
            'status.in' => 'Le statut doit être : Todo, In Progress ou Done.',

            'due_date.date' => 'La date d’échéance doit être une date valide.',

            'assigned_to.nullable' => 'Le champ assigné est facultatif, mais s’il est renseigné, il doit correspondre à un utilisateur existant.',

            'type.in' => 'Le type doit être l’une des valeurs suivantes : main, sub, story, bug.',
        ]);



        try {
            $task = Task::create($validated);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Une erreur est survenue lors de la création de la tâche.',
                'error' => $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Tâche créée avec succès.',
            'id_tache' => $task->task_id
        ], 201);
    }

    public function updateTache(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'type' => 'sometimes|required',
            'status' => 'sometimes|required',
            'due_date' => 'sometimes|nullable|date',
            'time' => 'sometimes|nullable',

        ]);

        $task = Task::find($id);

        if (!$task) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tâche non trouvée.',
            ], 404);
        }

        try {
            $task->update($validated);


            return response()->json([
                'status' => 'success',
                'message' => 'Statut de la tâche mis à jour avec succès.',
                'data' => $task,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Une erreur est survenue lors de la mise à jour.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getByProject($projectId)
    {
        try {
            $tasks = Task::where('project_id', $projectId)->get();

            if ($tasks->isEmpty()) {
                return response()->json([
                    'status' => 'empty',
                    'message' => 'Aucune tâche trouvée pour ce projet.',
                    'tasks' => []
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Tâches récupérées avec succès.',
                'tasks' => $tasks
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Une erreur est survenue lors de la récupération des tâches.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json([
                'status' => 'error',
                'message' => 'task non trouvé.',
            ], 404);
        }

        try {
            $task->delete();


            return response()->json([
                'status' => 'success',
                'message' => ' Tâches  supprimés avec succès.',
                'id_task_supprime' => $id,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Une erreur est survenue lors de la suppression.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
