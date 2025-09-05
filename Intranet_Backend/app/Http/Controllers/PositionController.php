<?php

namespace App\Http\Controllers;

use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PositionController extends Controller
{
    public function positionAll()
    {
        try {
            $positions = Position::all();
            return response()->json($positions, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des positions.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'assignements' => 'nullable|string|max:1000',
            'profil' => 'nullable|string|max:1000',
            'document_id' => 'nullable|integer|exists:documents,id',
        ];

        $messages = [
            'name.required' => 'Le nom du poste est requis.',
            'name.string' => 'Le nom du poste doit être une chaîne de caractères.',
            'name.max' => 'Le nom du poste ne peut pas dépasser 255 caractères.',

            'description.string' => 'La description doit être une chaîne de caractères.',
            'description.max' => 'La description ne peut pas dépasser 1000 caractères.',

            'assignements.string' => 'Les missions doivent être une chaîne de caractères.',
            'assignements.max' => 'Les missions ne peuvent pas dépasser 1000 caractères.',

            'profil.string' => 'Le profil doit être une chaîne de caractères.',
            'profil.max' => 'Le profil ne peut pas dépasser 1000 caractères.',

            'document_id.integer' => 'L\'ID du document doit être un nombre entier.',
            'document_id.exists' => 'Le document spécifié est introuvable.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation échouée.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $position = Position::create($validator->validated());

            return response()->json([
                'message' => 'Position créée avec succès.',
                'position' => $position,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la création de la position.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
