<?php

namespace App\Observers;

use App\Models\User;
use App\Notifications\LeaveBalanceThresholdReached;

class UserObserver
{
    public function updated(User $user)
    {
        if ($user->isDirty('ogc_leav_bal')) {
            $thresholds = [15, 20, 25, 30];
            $newBalance = $user->ogc_leav_bal;

            if (in_array($newBalance, $thresholds)) {
                $user->notify(new LeaveBalanceThresholdReached($newBalance));
            }
        }
    }
}
