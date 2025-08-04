<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sprint;

class SprintController extends Controller
{
    public function store(Request $request)
    {

        $validated = $request->validate([
            'id_projet' => 'required|exists:intranet_extedim.projects,project_id',
            'nom_sprint' => 'required|string|max:255',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date',
            'statut' => 'required',
        ], [
            'id_projet.required' => 'Le projet associé est obligatoire.',
            'id_projet.exists' => 'Le projet spécifié n’existe pas.',

            'nom_sprint.required' => 'Le nom du sprint est obligatoire.',
            'nom_sprint.string' => 'Le nom du sprint doit être une chaîne de caractères.',
            'nom_sprint.max' => 'Le nom du sprint ne doit pas dépasser 255 caractères.',

            'date_debut.date' => 'La date de début doit être une date valide.',
            'date_fin.date' => 'La date de fin doit être une date valide.',
            'date_fin.after_or_equal' => 'La date de fin doit être postérieure ou égale à la date de début.',

            'statut.required' => 'Le statut du sprint est obligatoire.',
            'statut.in' => 'Le statut doit être : En préparation, En cours ou Terminé.',
        ]);


        try {
            $sprint = Sprint::create($validated);

            if (!$sprint) {
                return response()->json([
                    'statut' => 'error',
                    'message' => 'La création du sprint a échoué.',
                ], 500);
            }

            return response()->json([
                'statut' => 'success',
                'message' => 'Sprint créée avec succès.',
                'id_sprint' => $sprint->id_sprint
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'statut' => 'error',
                'message' => 'Erreur lors de la création.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getSprintById($sprintId)
    {

        $sprint = Sprint::with('taches')
            ->where('id_sprint', $sprintId)
            ->first();

        if (!$sprint) {
            return response()->json([
                'message' => "Aucun sprint trouvé pour cet ID {$sprintId}."
            ], 404);
        }

        return response()->json([
            'message' => 'Projet récupéré avec succès.',
            'data' => $sprint->toArray(),
        ], 200);
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

        $validated = $request->validate([
            'id_projet'   => 'sometimes|exists:intranet_extedim.projects,project_id',
            'nom_sprint'  => 'sometimes|string|max:255',
            'date_debut'  => 'nullable|date',
            'date_fin'    => 'nullable|date|after_or_equal:date_debut',
            'statut'      => 'sometimes|string',
        ], [
            'id_projet.exists' => 'Le projet spécifié n’existe pas.',

            'nom_sprint.string' => 'Le nom du sprint doit être une chaîne de caractères.',
            'nom_sprint.max' => 'Le nom du sprint ne doit pas dépasser 255 caractères.',

            'date_debut.date' => 'La date de début doit être une date valide.',
            'date_fin.date' => 'La date de fin doit être une date valide.',
            'date_fin.after_or_equal' => 'La date de fin doit être postérieure ou égale à la date de début.',

            'statut.string' => 'Le statut doit être une chaîne de caractères.',
        ]);

        try {
            $sprint->update($validated);

            return response()->json([
                'statut' => 'success',
                'message' => 'Sprint mis à jour avec succès.',
                'sprint' => $sprint,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'statut' => 'error',
                'message' => 'Erreur lors de la mise à jour.',
                'error' => $e->getMessage(),
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

    public function getOneSprintById($id)
    {
        return Sprint::where('id_sprint', $id)->first();
    }
}
