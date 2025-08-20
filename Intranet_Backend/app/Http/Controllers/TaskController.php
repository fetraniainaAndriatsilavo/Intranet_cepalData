<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Validation\Rule;


class TaskController extends Controller
{
    public function getAllTask()
    {
        $tasks = Task::with('project', 'sprint')->get();

        return response()->json($tasks);
    }

    public function getTaskById($taskId)
    {

        $sprint = Task::with('taches')
            ->where('id', $taskId)
            ->first();

        if (!$sprint) {
            return response()->json([
                'message' => "Aucun sprint trouvé pour cet ID {$taskId}."
            ], 404);
        }

        return response()->json([
            'message' => 'Sprint récupéré avec succès.',
            'data' => $sprint->toArray(),
        ], 200);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255|unique:intranet_extedim.tasks,title',
                'description' => 'nullable|string',
                'project_id' => 'nullable|exists:intranet_extedim.projects,id',
                'type' => 'required|in:Task,Sub_Task,Story,Bug',
                'priority' => 'required|string|max:50',
                'status' => 'required|in:To-Do,In-Progress,Review,Deploy,Done',
                'start_date' => 'nullable|date',
                'due_date' => 'nullable|date|after_or_equal:start_date',
                'sprint_id' => 'nullable|exists:intranet_extedim.sprints,id',
                'task_parent_id' => 'nullable|exists:intranet_extedim.tasks,id',
                'time' => 'nullable',
                'updated_by' => 'nullable|exists:intranet_extedim.users,id',
                'user_allocated_id' => 'nullable|exists:intranet_extedim.users,id',
            ], [
                'title.required' => 'Le titre est obligatoire.',
                'title.string' => 'Le titre doit être une chaîne de caractères.',
                'title.max' => 'Le titre ne doit pas dépasser 255 caractères.',
                'title.unique' => 'Titre déjà utilisé',

                'description.string' => 'La description doit être une chaîne de caractères.',

                'project_id.exists' => 'Le projet spécifié n’existe pas.',

                'type.required' => 'Le type de tâche est obligatoire.',
                'type.in' => 'Le type doit être : Task, Sub_Task, Story ou Bug.',

                'priority.required' => 'La priorité est obligatoire.',
                'priority.string' => 'La priorité doit être une chaîne de caractères.',
                'priority.max' => 'La priorité ne doit pas dépasser 50 caractères.',

                'status.required' => 'Le statut est obligatoire.',
                'status.in' => 'Le statut doit être : To-Do, In-Progress, Review, Deploy ou Done.',

                'start_date.date' => 'La date de début doit être une date valide.',
                'due_date.date' => 'La date de fin doit être une date valide.',
                'due_date.after_or_equal' => 'La date de fin doit être postérieure ou égale à la date de début.',

                'sprint_id.exists' => 'Le sprint spécifié n’existe pas.',

                'task_parent_id.exists' => 'La tâche parente spécifiée n’existe pas.',

                'updated_by.exists' => 'L’utilisateur qui met à jour n’a pas été trouvé.',

                'user_allocated_id.exists' => 'L’utilisateur assigné n’a pas été trouvé.',
            ]);

            $validated = array_merge($validated, [
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $task = Task::create($validated);

            if (!$task) {
                return response()->json([
                    'statut' => 'error',
                    'message' => 'La création de la tache a échoué.',
                ], 500);
            }

            return response()->json([
                'statut' => 'success',
                'message' => 'Tache créé avec succès.',
                'details' => $task
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'statut' => 'error',
                'type' => 'validation',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'statut' => 'error',
                'type' => 'exception',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateTask(Request $request, $id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json([
                'statut' => 'error',
                'message' => 'Tâche non trouvée.',
            ], 404);
        }

        try {
            // Validation avec messages personnalisés
            $validated = $request->validate([
                'title' => [
                    'sometimes',
                    'string',
                    'max:255',
                    Rule::unique('intranet_extedim.tasks', 'title')->ignore($id),
                ],
                'description' => 'nullable|string',
                'project_id' => 'nullable|exists:intranet_extedim.projects,id',
                'type' => 'sometimes|in:Task,Sub_Task,Story,Bug',
                'priority' => 'sometimes|string|max:50',
                'status' => 'sometimes|in:To-Do,In-Progress,Review,Deploy,Done',
                'start_date' => 'nullable|date',
                'due_date' => 'nullable|date|after_or_equal:start_date',
                'sprint_id' => 'nullable|exists:intranet_extedim.sprints,id',
                'task_parent_id' => 'nullable|exists:intranet_extedim.tasks,id',
                'time' => 'nullable',
                'updated_by' => 'nullable|exists:intranet_extedim.users,id',
                'user_allocated_id' => 'nullable|exists:intranet_extedim.users,id',
            ], [
                'title.string' => 'Le titre doit être une chaîne de caractères.',
                'title.max' => 'Le titre ne doit pas dépasser 255 caractères.',
                'title.unique' => 'Ce titre est déjà utilisé.',

                'description.string' => 'La description doit être une chaîne de caractères.',

                'project_id.exists' => 'Le projet spécifié n’existe pas.',

                'type.in' => 'Le type doit être : Task, Sub_Task, Story ou Bug.',

                'priority.string' => 'La priorité doit être une chaîne de caractères.',
                'priority.max' => 'La priorité ne doit pas dépasser 50 caractères.',

                'status.in' => 'Le statut doit être : To-Do, In-Progress, Review, Deploy ou Done.',

                'start_date.date' => 'La date de début doit être une date valide.',
                'due_date.date' => 'La date de fin doit être une date valide.',
                'due_date.after_or_equal' => 'La date de fin doit être postérieure ou égale à la date de début.',

                'sprint_id.exists' => 'Le sprint spécifié n’existe pas.',

                'task_parent_id.exists' => 'La tâche parente spécifiée n’existe pas.',

                'updated_by.exists' => 'L’utilisateur qui met à jour n’a pas été trouvé.',

                'user_allocated_id.exists' => 'L’utilisateur assigné n’a pas été trouvé.',
            ]);

            // Mise à jour
            $task->update($validated);

            return response()->json([
                'statut' => 'success',
                'message' => 'Tâche mise à jour avec succès.',
                'details' => $task
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'statut' => 'error',
                'type' => 'validation',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'statut' => 'error',
                'type' => 'exception',
                'message' => $e->getMessage(),
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
