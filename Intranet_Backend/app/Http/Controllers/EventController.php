<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Exception;

class EventController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'date' => 'required|date',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        }

        try {
            $event = Event::create([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'date' => $validated['date'],
            ]);

            return response()->json([
                'message' => 'Événement créé avec succès',
                'evenement' => $event
            ], 201);
        } catch (Exception $e) {
            Log::error('Erreur lors de la création de l\'événement : ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Erreur serveur lors de la création de l\'événement',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getEvent()
    {
        Event::where('date', '<', now())->delete();
        $events = Event::where('date', '>', now())->orderBy('date', 'asc')->take(3)->get();

        return response()->json([
            'evenements' => $events
        ]);
    }

    public function destroy($id)
    {
        $event = Event::find($id);
        if (!$event) {
            return response()->json(['message' => 'Événement non trouvé'], 404);
        }

        $event->delete();

        return response()->json(['message' => 'Événement supprimé'], 200);
    }
}
