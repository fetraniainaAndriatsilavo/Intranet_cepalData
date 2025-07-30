<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class AjouterSoldeMensuel extends Command
{
    protected $signature = 'solde:ajouter-mensuel';
    protected $description = 'Ajoute 2 jours au solde de chaque employé chaque mois';

    public function handle()
    {
        try {
            $employes = DB::table('intranet_extedim.ogc_cumul')->get();

            foreach ($employes as $emp) {
                $ancien = $emp->leave_days;
                $nouveau = $ancien - 2;

                DB::table('intranet_extedim.ogc_cumul')
                    ->where('user_id', $emp->user_id)
                    ->update(['leave_days' => $nouveau]);
            }

            $this->info('Solde mis à jour pour tous les employés.');
        } catch (\Exception $e) {
            $this->error('Erreur : ' . $e->getMessage());
        }
    }
}
