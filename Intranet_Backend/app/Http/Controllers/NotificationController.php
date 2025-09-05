<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\AdminErrorReportNotification;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{

    public function getUserNotifications($userId)
    {
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $notifications = $user->unreadNotifications()->orderBy('created_at', 'desc')->get();

        return response()->json($notifications);
    }

    public function markAsRead(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|exists:intranet_extedim.users,id',
        ]);

        $user = User::findOrFail($request->user_id);

        $notification = $user->notifications()->findOrFail($id);

        $notification->markAsRead();

        return response()->json(['message' => 'Notification marquée comme lue.']);
    }

    public function getAdminErrorReports()
    {
        $adminNotifications = collect();

        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            $notifications = $admin->unreadNotifications
                ->where('type', AdminErrorReportNotification::class);

            $adminNotifications = $adminNotifications->concat($notifications);
        }

        return response()->json([
            'notifications' => $adminNotifications->values(),
        ]);
    }

    public function markErrorAsRead($id)
    {
        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            $notification = $admin->unreadNotifications()->find($id);
            if ($notification) {
                $notification->markAsRead();

                return response()->json(['message' => 'Notification marquée comme lue']);
            }
        }

        return response()->json(['message' => 'Notification introuvable'], 404);
    }

    public function deleteNotification(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required'
        ]);

        $user = User::findOrFail($request->user_id);
        $notification = $user->notifications()->findOrFail($id);
        $notification->delete();
        return response()->json('Notification supprimé');
    }
}
