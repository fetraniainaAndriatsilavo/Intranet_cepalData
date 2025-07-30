<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use App\Models\OgCumul;
use Illuminate\Http\Request;

class OgCumulController extends Controller
{
    /**
     * Retourne les cumuls d'un utilisateur spécifique.
     */
    public function getCumulByUserId($userId)
    {
        $userCumul = OgCumul::where('user_id', $userId)->first();

        $userLeaveRequests = LeaveRequest::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        if (!$userCumul) {
            return response()->json([
                'message' => "Aucun cumul trouvé pour l'utilisateur ID {$userId}."
            ], 404);
        }

        return response()->json([
            'message' => 'Données de cumul récupérées avec succès.',
            'data' => $userCumul,
            'requests' => $userLeaveRequests
        ], 200);
    }


    /**
     * Retourne tous les cumuls.
     */
    public function getAllCumuls()
    {
        $allCumuls = OgCumul::all();

        if ($allCumuls->isEmpty()) {
            return response()->json([
                'message' => 'Aucun cumul trouvé.'
            ], 404);
        }

        return response()->json([
            'message' => 'Tous les cumuls récupérés avec succès.',
            'data' => $allCumuls
        ], 200);
    }
}
