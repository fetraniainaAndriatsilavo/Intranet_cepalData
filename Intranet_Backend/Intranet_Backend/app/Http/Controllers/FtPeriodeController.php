<?php

namespace App\Http\Controllers;

use App\Models\FtPeriode;
use App\Models\SessionPeriode;
use App\Models\User;
use App\Models\UserDetails;
use Illuminate\Http\Request;

class FtPeriodeController extends Controller
{

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|string',
            'user_id' => 'required'
        ]);

        $session = FtPeriode::create($validated);

        return response()->json([
            'message' => 'Session créée avec succès',
            'data' => $session
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $session = FtPeriode::findOrFail($id);

        $rules = [
            'status' => 'sometimes|in:en_attente,validé',
        ];

        $messages = [
            'status.in' => 'Le statut doit être : en_attente ou validé.',
        ];

        try {
            $validated = $request->validate($rules, $messages);

            $session->update($validated);

            return response()->json([
                'message' => 'Session mise à jour avec succès',
                'data' => $session
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function getSessionByUser($userId){
        $sessions = FtPeriode::where('user_id',$userId)->orderBy('created_at', 'desc')->take(3)->get();
        return response()->json($sessions);
    }

    public function getSessionById($sessionId){
        $session = FtPeriode::where('id',$sessionId)->orderBy('created_at', 'desc')->first();
        return response()->json($session);
    }

    public function getAllSession()
    {
        $sessions = FtPeriode::orderBy('created_at', 'desc')->take(3)->get();
        return response()->json($sessions);
    }

   public function getAllSessionsByManager($managerId)
    {
        $manager = User::find($managerId);

        if (!$manager) {
            return response()->json(['message' => 'Manager introuvable'], 404);
        }

        $userIds = UserDetails::where('manager_id', $managerId)->pluck('user_id');

        if ($userIds->isEmpty()) {
            return response()->json(['message' => 'Aucun employé rattaché'], 404);
        }

        $sessions = FtPeriode::with(['user.userDetail'])
            ->whereIn('user_id', $userIds)
            ->where('status', 'en_attente')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        if ($sessions->isEmpty()) {
            return response()->json(['message' => 'Aucune session trouvée pour les employés rattachés'], 404);
        }

        return response()->json([
            'message' => 'Sessions trouvées',
            'data' => $sessions
        ]);
    }

    public function getAllSessionsBackOffice()
    {
        
        $sessions = FtPeriode::with(['user.userDetail'])
            ->where('status', 'validé')
            ->orderBy('created_at', 'desc')
            ->get();

        if ($sessions->isEmpty()) {
            return response()->json(['message' => 'Aucune session trouvée pour les employés '], 404);
        }

        return response()->json([
            'message' => 'Sessions trouvées',
            'data' => $sessions
        ]);
    }



}
