<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class ReferenceDataController extends Controller
{


    public function getDataUser()
    {
        try {
            $clients = DB::table('intranet_extedim.clients')
                ->pluck('name', 'code')
                ->map(function ($name, $code) {
                    return ['name' => $name, 'code' => $code];
                })
                ->values()
                ->toArray();

            $contractTypes = DB::table('intranet_extedim.contracts_type')
                ->pluck('code')
                ->toArray();

            $departments = DB::table('intranet_extedim.departments')
                ->pluck('name', 'id')
                ->toArray();

            $classifications = DB::table('intranet_extedim.classifications')
                ->pluck('categ_name', 'id')
                ->toArray();

            $positions = DB::table('intranet_extedim.positions')
                ->pluck('name', 'id')
                ->toArray();

            $managers = DB::table('intranet_extedim.users')
                ->where('role', 'manager')
                ->select('id', 'first_name')
                ->get();


            return response()->json([
                'clients' => $clients,
                'contract_types' => $contractTypes,
                'departments' => $departments,
                'classifications' => $classifications,
                'managers' => $managers,
                'positions' => $positions,

            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des données.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
