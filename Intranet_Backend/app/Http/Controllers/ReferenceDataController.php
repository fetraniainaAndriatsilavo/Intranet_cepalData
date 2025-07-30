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
                ->toArray();

            $contractTypes = DB::table('intranet_extedim.contracts_type')
                ->pluck('code')
                ->toArray();

            $departments = DB::table('intranet_extedim.departments')
                ->pluck('name')
                ->toArray();

            $classifications = DB::table('intranet_extedim.classifications')
                ->pluck('categ_name')
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
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des données.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
