<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sprint;
use Illuminate\Validation\Rule;

class SprintController extends Controller
{
    public function getAllSprint()
    {
        $sprints = Sprint::with('taches')->get();

        return response()->json($sprints);
    }

    public function getSprintById($sprintId)
    {

        $sprint = Sprint::with('taches')
            ->where('id', $sprintId)
            ->first();

        if (!$sprint) {
            return response()->json([
                'message' => "Aucun sprint trouvé pour cet ID {$sprintId}."
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
                'project_id' => 'required|exists:intranet_extedim.projects,id',
                'title' => 'required|string|max:255|unique:intranet_extedim.sprints, title',
                'start_date' => 'nullable|date',
                'due_date' => 'nullable|date|after_or_equal:start_date',
                'status' => 'required|in:To-Do,In-Progress,Deploy,Review,Done',
                'updated_by' => 'nullable|exists:intranet_extedim.users,id',
            ], [
                'project_id.required' => 'Le projet associé est obligatoire.',
                'project_id.exists' => 'Le projet spécifié n’existe pas.',

                'title.required' => 'Le nom du sprint est obligatoire.',
                'title.string' => 'Le nom du sprint doit être une chaîne de caractères.',
                'title.max' => 'Le nom du sprint ne doit pas dépasser 255 caractères.',
                'title.unique' => 'Titre déjà utilisé',

                'start_date.date' => 'La date de début doit être une date valide.',
                'due_date.date' => 'La date de fin doit être une date valide.',
                'due_date.after_or_equal' => 'La date de fin doit être postérieure ou égale à la date de début.',

                'status.required' => 'Le statut du sprint est obligatoire.',
                'status.in' => 'Le statut doit être : To-Do, In-Progress, Deploy, Review ou Done.',

                'updated_by.exists' => 'Utilisateur non trouvé',
            ]);

            $validated = array_merge($validated, [
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $sprint = Sprint::create($validated);

            if (!$sprint) {
                return response()->json([
                    'statut' => 'error',
                    'message' => 'La création du sprint a échoué.',
                ], 500);
            }

            return response()->json([
                'statut' => 'success',
                'message' => 'Sprint créé avec succès.',
                'details' => $sprint
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

    public function updateSprint(Request $request, $id)
    {
        $sprint = Sprint::find($id);

        if (!$sprint) {
            return response()->json([
                'statut' => 'error',
                'message' => 'Sprint non trouvé.',
            ], 404);
        }

        try {
            $validated = $request->validate([
                'project_id' => 'sometimes|exists:intranet_extedim.projects,id',
                'title' => [
                    'sometimes',
                    'string',
                    'max:255',
                    Rule::unique('intranet_extedim.sprints', 'title')->ignore($id),
                ],
                'start_date' => 'nullable|date',
                'due_date' => 'nullable|date|after_or_equal:start_date',
                'status' => 'sometimes|in:To-Do,In-Progress,Deploy,Review,Done',
                'updated_by' => 'nullable|exists:intranet_extedim.users,id',
            ], [
                'project_id.exists' => 'Le projet spécifié n’existe pas.',

                'title.string' => 'Le nom du sprint doit être une chaîne de caractères.',
                'title.max' => 'Le nom du sprint ne doit pas dépasser 255 caractères.',
                'title.unique' => 'Ce titre de sprint est déjà utilisé.',

                'start_date.date' => 'La date de début doit être une date valide.',
                'due_date.date' => 'La date de fin doit être une date valide.',
                'due_date.after_or_equal' => 'La date de fin doit être postérieure ou égale à la date de début.',

                'status.in' => 'Le statut doit être : To-Do, In-Progress, Deploy, Review ou Done.',
                'updated_by.exists' => 'Utilisateur non trouvé.',
            ]);

            $sprint->update($validated);

            return response()->json([
                'statut' => 'success',
                'message' => 'Sprint mis à jour avec succès.',
                'sprint' => $sprint,
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

    public function destroy($id)
    {
        $sprint = Sprint::find($id);

        if (!$sprint) {
            return response()->json([
                'status' => 'error',
                'message' => 'Sprint non trouvé.',
            ], 404);
        }

        try {
            $sprint->tasks()->delete();
            $sprint->delete();


            return response()->json([
                'status' => 'success',
                'message' => 'Sprint et ses tâches  supprimés avec succès.',
                'id_sprint_supprime' => $id,
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
