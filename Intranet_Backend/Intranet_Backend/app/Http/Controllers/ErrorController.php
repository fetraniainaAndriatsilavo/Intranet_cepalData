<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use App\Notifications\AdminErrorReportNotification;

class ErrorController extends Controller
{
    public function report(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:intranet_extedim.users,id',
            'errors' => 'required|array',
            'errors.*.field' => 'required|string',
        ]);

        $user = User::findOrFail($request->user_id);

        $admins = User::where('role', 'admin')->get();

        Notification::send($admins, new AdminErrorReportNotification($user, $request->errors));

        return response()->json(['message' => 'Signalement envoyé aux administrateurs.']);
    }
}
