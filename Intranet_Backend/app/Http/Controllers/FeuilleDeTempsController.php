<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FeuilleDeTemps;
use App\Models\FtPeriode;
use App\Models\User;
use App\Models\UserDetails;

class FeuilleDeTempsController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'heure' => 'required|string',
            'client' => 'nullable|string|max:100',
            'projet' => 'nullable|string|max:100',
            'type' => 'required|in:conges,recuperation,tache,ferie,repos medical',
            'description' => 'nullable|string',
            'user_id' => 'required|exists:intranet_extedim.users,id',
            'ft_periode_id' => 'required'
        ]);

        $feuille = FeuilleDeTemps::create($validated);

        return response()->json([
            'message' => 'Feuille de temps créée avec succès',
            'data' => $feuille
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $feuille = FeuilleDeTemps::findOrFail($id);

        $rules = [
            'date' => 'sometimes|date',
            'heure' => 'sometimes|string',
            'client' => 'nullable|string|max:100',
            'projet' => 'nullable|string|max:100',
            'type' => 'sometimes|in:conges,recuperation,tache,ferie,repos medical',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:en attente,envoyé,validé',
        ];

        $messages = [
            'date.date' => 'La date doit être une date valide.',
            'heure.string' => 'L\'heure doit être une chaîne de caractères.',
            'client.string' => 'Le client doit être une chaîne de caractères.',
            'client.max' => 'Le nom du client ne peut pas dépasser 100 caractères.',
            'projet.string' => 'Le projet doit être une chaîne de caractères.',
            'projet.max' => 'Le nom du projet ne peut pas dépasser 100 caractères.',
            'type.in' => 'Le type doit être l\'une des valeurs suivantes : congés, récupération, tâche, férié, repos médical.',
            'status.in' => 'Le statut doit être : en attente, envoyé ou validé.',
        ];

        try {
            $validated = $request->validate($rules, $messages);

            $feuille->update($validated);

            return response()->json([
                'message' => 'Feuille de temps mise à jour avec succès',
                'data' => $feuille
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function getByUserAndPeriode($userId, $periodeId)
    {
        $feuillesDeTemps = FeuilleDeTemps::with(['ftPeriode:id,id,date'])
            ->where('user_id', $userId)
            ->where('ft_periode_id', $periodeId)
            ->orderBy('created_at', 'desc')
            ->get();

        return $feuillesDeTemps;
    }

    public function getSessionsByManager($managerId)
    {
        $manager = User::find($managerId);

        if (!$manager) {
            return response()->json(['message' => 'Manager introuvable'], 404);
        }

        $userIds = UserDetails::where('manager_id', $managerId)->pluck('user_id');

        if ($userIds->isEmpty()) {
            return response()->json(['message' => 'Aucun employé rattaché'], 404);
        }

        $feuilles = FeuilleDeTemps::with(['user', 'ftPeriode'])
            ->whereIn('user_id', $userIds)
            ->whereHas('ftPeriode', function ($query) {
                $query->where('status', 'en_attente');
            })
            ->orderBy('created_at', 'desc')
            ->get();

        if ($feuilles->isEmpty()) {
            return response()->json(['message' => 'Aucune feuille de temps trouvée avec une session en attente'], 404);
        }

        $grouped = $feuilles->groupBy(function ($item) {
            return $item->user_id . '_' . $item->ft_periode_id;
        });

        $result = [];

        foreach ($grouped as $group) {
            $first = $group->first();
            $result[] = [
                'user' => $first->user->name ?? 'Inconnu',
                'ft_periode_id' => $first->ft_periode_id,
                'ft_periode' => $first->ftPeriode->date ?? 'Inconnu',
                'status' => $first->ftPeriode->status,
                'feuilles_de_temps' => $group->map(function ($feuille) {
                    return [
                        'id' => $feuille->id,
                        'date' => $feuille->date,
                        'heure' => $feuille->heure,
                        'client' => $feuille->client,
                        'projet' => $feuille->projet,
                        'type' => $feuille->type,
                        'description' => $feuille->description,
                        'created_at' => optional($feuille->created_at)->toDateString(),
                    ];
                })->values()
            ];
        }

        return response()->json($result);
    }

    public function getFeuileFromBackOffice($userId, $periodeId)
    {
        $user = User::find($userId);
        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur introuvable',
                'error' => 'Aucun utilisateur trouvé avec cet ID'
            ], 404);
        }

        $periode = FtPeriode::find($periodeId);
        if (!$periode) {
            return response()->json([
                'message' => 'Session introuvable',
                'error' => 'Aucune session trouvée avec cet ID'
            ], 404);
        }

        $feuillesDeTemps = FeuilleDeTemps::with(['ftPeriode:id,id,date'])
            ->where('user_id', $userId)
            ->where('ft_periode_id', $periodeId)
            ->orderBy('created_at', 'desc')
            ->get();

        if ($feuillesDeTemps->isEmpty()) {
            return response()->json([
                'message' => 'Aucune feuille de temps trouvée pour cet utilisateur dans cette session'
            ], 404);
        }

        $congesCount = $feuillesDeTemps->where('type', 'conges')->count();
        $feriesCount = $feuillesDeTemps->where('type', 'feries')->count();
        $reposMedicalCount = $feuillesDeTemps->where('type', 'repos medical')->count();
        $recuperationCount = $feuillesDeTemps->where('type', 'recuperation')->count();
        $taches = $feuillesDeTemps->where('type', 'tache');
        $tacheCount = $taches->count();
        $totalHeuresSession = $feuillesDeTemps->sum(function ($f) {
            return floatval($f->heure);
        });


        return response()->json([
            'message' => 'Feuilles de temps et statistiques récupérées avec succès',
            'user' => $user->name,
            'session' => [
                'id' => $periode->id,
                'session' => $periode->date
            ],
            'feuilles_de_temps' => $feuillesDeTemps,
            'statistiques' => [
                'conges' => $congesCount,
                'feries' => $feriesCount,
                'repos_medical' => $reposMedicalCount,
                'recuperation' => $recuperationCount,
                'tache' => [
                    'count' => $tacheCount,
                    'total_heures' => $totalHeuresSession
                ]
            ]
        ]);
    }

}
