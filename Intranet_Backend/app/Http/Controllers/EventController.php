<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\User;
use App\Notifications\NewEventCreated;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Exception;
use Illuminate\Support\Facades\Notification;

class EventController extends Controller
{
    public function getEvent()
    {
        Event::where('date', '<', now())->delete();
        $events = Event::where('date', '>', now())->orderBy('date', 'asc')->take(3)->get();

        return response()->json([
            'evenements' => $events
        ]);
    }

    public function getEventInfo($eventId)
    {
        $event = Event::where('id', $eventId)->first();
        return response()->json([
            'evenements' => $event
        ]);
    }

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

            $users = User::all();
            Notification::send($users, new NewEventCreated($event));

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

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'date' => 'sometimes|required|date',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        }

        try {
            $event = Event::findOrFail($id);

            $event->update($validated);

            return response()->json([
                'message' => 'Événement mis à jour avec succès',
                'evenement' => $event
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Événement non trouvé'
            ], 404);
        } catch (Exception $e) {
            Log::error('Erreur lors de la mise à jour de l\'événement : ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Erreur serveur lors de la mise à jour de l\'événement',
                'error' => $e->getMessage(),
            ], 500);
        }
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
