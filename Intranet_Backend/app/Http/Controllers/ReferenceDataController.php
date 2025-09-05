<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;

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

    public function overview($userId)
    {
        try {
            if (!$userId || !DB::table('intranet_extedim.users')->where('id', $userId)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non trouvé',
                    'userId'  => $userId
                ], 404);
            }

            $userBalances = DB::table('intranet_extedim.users as u')
                ->select(
                    'u.id',
                    DB::raw("COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'') as full_name"),
                    'u.ogc_leav_bal',
                    'u.ogc_perm_bal',
                    'u.gender',
                    'u.role',
                    'u.contrat_code'
                )
                ->where('u.id', $userId)
                ->first();

            $byDepartment = DB::table('intranet_extedim.users as u')
                ->leftJoin('intranet_extedim.departments as d', 'd.id', '=', 'u.department_id')
                ->select(
                    'u.department_id',
                    DB::raw('COALESCE(d.name, \'(Sans département)\') as department_name'),
                    DB::raw('COUNT(*) as total'),
                    DB::raw("SUM(CASE WHEN u.gender = 'male' THEN 1 ELSE 0 END) as male"),
                    DB::raw("SUM(CASE WHEN u.gender = 'female' THEN 1 ELSE 0 END) as female"),
                    DB::raw("SUM(CASE WHEN u.role = 'admin' THEN 1 ELSE 0 END) as role_admin"),
                    DB::raw("SUM(CASE WHEN u.role = 'manager' THEN 1 ELSE 0 END) as role_manager"),
                    DB::raw("SUM(CASE WHEN u.role = 'user' THEN 1 ELSE 0 END) as role_user")
                )
                ->groupBy('u.department_id', 'd.name')
                ->orderBy('department_name')
                ->get();

            $byContract = DB::table('intranet_extedim.contracts_type as ct')
                ->leftJoin('intranet_extedim.users as u', 'u.contrat_code', '=', 'ct.code')
                ->select('ct.code', 'ct.name', DB::raw('COUNT(u.id) as users_count'))
                ->groupBy('ct.code', 'ct.name')
                ->orderBy('ct.name')
                ->get();

            $byRole = DB::table('intranet_extedim.users')
                ->select(
                    'role',
                    DB::raw('COUNT(*) as total_users')
                )
                ->groupBy('role')
                ->get();

            $projects = DB::table('intranet_extedim.projects as p')
                ->select('p.id', 'p.name', 'p.status', 'p.start_date')
                ->whereIn('p.status', ['To-Do', 'In-Progress', 'Review', 'Deploy', 'Done'])
                ->orderBy('p.start_date', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'user'          => $userBalances,
                    'by_department' => $byDepartment,
                    'by_contract'   => $byContract,
                    'by_role'       => $byRole,
                    'projects'      => $projects
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la génération du dashboard',
                'error'   => $e->getMessage(),
                'line'    => $e->getLine(),
                'file'    => $e->getFile(),
                'trace'   => $e->getTraceAsString()
            ], 500);
        }
    }
}
