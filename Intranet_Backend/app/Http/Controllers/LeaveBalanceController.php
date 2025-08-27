<?php

namespace App\Http\Controllers;

use App\Models\OgCumul;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LeaveBalanceController extends Controller
{
    public function ajouterSoldeMensuel()
    {
        try {
            $employes = DB::table('intranet_extedim.ogc_cumul')->get();
            $resultats = [];

            foreach ($employes as $emp) {
                $ancien = $emp->leave_days;
                $nouveau = $ancien + 2;

                DB::table('intranet_extedim.ogc_cumul')
                    ->where('user_id', $emp->user_id)
                    ->update(['leave_days' => $nouveau]);

                $resultats[] = [
                    'user_id' => $emp->user_id,
                    'ancien_solde' => $ancien,
                    'nouveau_solde' => $nouveau
                ];
            }

            return response()->json([
                'message' => 'Solde mis à jour pour tous les employés',
                'details' => $resultats
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise à jour du solde',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
