<?php

use App\Http\Controllers\API\GroupController;
use App\Http\Controllers\API\GroupMessageController;
use App\Http\Controllers\API\MessageController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\DocumentsAdminController;
use App\Http\Controllers\ErrorController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FeuilleDeTempsController;
use App\Http\Controllers\FtPeriodeController;
use App\Http\Controllers\GroupPostController;
use App\Http\Controllers\LeaveBalanceController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OgCumulController;
use App\Http\Controllers\PeriodeController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ReactionController;
use App\Http\Controllers\ReferenceDataController;
use App\Http\Controllers\SprintController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TimesheetController;
use App\Http\Controllers\UserController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;



//Autehntification
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/v1/auth', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

//Utilisateur
Route::post('/positions', [PositionController::class, 'store']);
Route::get('/dashboard/overview/{userId}', [ReferenceDataController::class, 'overview']);
Route::get('/data', [ReferenceDataController::class, 'getDataUser']);
Route::get('/user/{id}/info', [UserController::class, 'GetInfoUser']);
Route::put('/user/{id}/update', [UserController::class, 'update']);
Route::get('/getUser/all', [UserController::class, 'GetAllUsers']);
Route::put('v1/users/{id}', [UserController::class, 'toggleStatus']);
Route::get('v1/personal/{id}', [UserController::class, 'personal']);
Route::put('/users/{id}/public', [UserController::class, 'updatePublic']);
Route::get('v1/checkers/{id}', function ($id) {
    $user = User::where('id', $id)->first();
    if (!$user) {
        return response()->json(['message' => 'Utilisateur non trouvé'], 404);
    } else {
        return response()->json(['role' => $user->role]);
    }
});
Route::get('v1/modify/{id}', [UserController::class, 'personal']);
Route::post('/change-password/{userId}', [UserController::class, 'changePassword']);
Route::post('/forgot-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);
    try {
        $status = Password::sendResetLink($request->only('email'));
        return response()->json([
            'message' => __($status),
            'email' => $request->email
        ]);
    } catch (Exception $e) {
        return response()->json(['message' => __($e->getMessage())]);
    }
});



Route::post('/reset-password', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'token' => 'required',
        'password' => ['required', 'confirmed', PasswordRule::min(8)]
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user, $password) {
            $user->forceFill([
                'password' => bcrypt($password),
            ])->save();
        }
    );

    return $status === Password::PASSWORD_RESET
        ? response()->json(['message' => __($status)])
        : response()->json(['message' => __($status)], 400);
});

Route::get('reset-password/{token}', function ($token) {
    return response()->json(['token' => $token]);
})->name('password.reset');

//Module Projet
Route::post('/projects/store', [ProjectController::class, 'store']);
Route::put('/projects/{id}/status', [ProjectController::class, 'updateStatus']);
Route::get('/getProject/{userId}', [ProjectController::class, 'getProjectByUserId']);
Route::put('/projects/{id}/update', [ProjectController::class, 'updateProject']);
Route::delete('/projects/{id}/delete', [ProjectController::class, 'destroy']);
Route::get('/projects/{id}/getProject', [ProjectController::class, 'getProjectById']);

//Sprint (Module Projet)
Route::post('/sprints', [SprintController::class, 'store']);
Route::get('/sprints/all', [SprintController::class, 'getAllSprint']);
Route::get('/getSprint/{sprintId}', [SprintController::class, 'getSprintById']);
Route::put('/sprints/{id}/update', [SprintController::class, 'updateSprint']);
Route::delete('/sprints/{id}/delete', [SprintController::class, 'destroy']);

//Tache (Module Projet)
Route::post('/tasks', [TaskController::class, 'store']);
Route::get('/tasks/all', [TaskController::class, 'getAllTask']);
Route::get('/gettask/{taskId}', [TaskController::class, 'getTaskById']);
Route::get('/taches/{id}/getTache', [TaskController::class, 'getTacheById']);
Route::get('/getTaches/{projectId}', [TaskController::class, 'getByProject']);
Route::put('/taches/{id}/update', [TaskController::class, 'update']);
Route::delete('/taches/{id}/delete', [TaskController::class, 'destroy']);


//OGC
Route::post('/leave-requests', [LeaveRequestController::class, 'store']);
Route::get(
    '/type/leave',
    [LeaveRequestController::class, 'getAllTypeLeave']
);
Route::get('/users/{id}/leave-balances', [LeaveRequestController::class, 'getLeaveBalances']);
Route::get('manager/{managerId}/leave-requests', [LeaveRequestController::class, 'getTeamLeaveRequests']);
Route::get('/all-requests', [LeaveRequestController::class, 'getAllLeaveRequests']);
Route::put('/leave-requests/{id}/change', [LeaveRequestController::class, 'changeStatus']);
Route::get('/all/holidays', [LeaveRequestController::class, 'getOgcHolidays']);
Route::get('manager/{managerId}/userCumul', [LeaveRequestController::class, 'getTeamCumul']);
Route::patch('/conges/ajouter-solde', [LeaveBalanceController::class, 'ajouterSoldeMensuel']);

//Document Administratif
Route::get('/documents/type', [DocumentsAdminController::class, 'doc_type']);
Route::post('/documents-admin/upload', [DocumentsAdminController::class, 'upload']);
Route::get('/documents/user/{userId}', [DocumentsAdminController::class, 'getUserDocuments']);
Route::put('/document/{id}/changeStatus', [DocumentsAdminController::class, 'changeStatus']);


//Session FT
Route::get('/sessions/{id}', [PeriodeController::class, 'getSessionById']);
Route::post('/timesheet-periods/store', [PeriodeController::class, 'store']);
Route::put('/timesheet-periods/{id}/update', [PeriodeController::class, 'update']);
Route::delete('/timesheet-periods/{id}/destroy', [PeriodeController::class, 'destroy']);
Route::get('/timesheet-periods/all', [PeriodeController::class, 'getAll']);
Route::get('/timesheet-periods/{id}/timesheets', [PeriodeController::class, 'getTimesheetsByPeriod']);
Route::get('/timesheet-periods/active', [PeriodeController::class, 'getActiveSessionsWithUsersTotals']);
Route::get(
    '/timesheet-periods/grouped-by-manager/{managerId}',
    [PeriodeController::class, 'getActiveSessionsGroupedByManager']
);

//Feuille de temps
Route::get('/timesheet/{id}', [TimesheetController::class, 'getTimesheetById']);
Route::get('/timesheet/all', [TimesheetController::class, 'getAll']);
Route::get('/Alltimesheet/sent', [TimesheetController::class, 'getAllSentTimesheets']);
Route::get('/managers/{manager}/timesheets/sent', [TimesheetController::class, 'getTimesheetsForManager']);
Route::get('/timesheet/{id}/user', [TimesheetController::class, 'getUserTimesheets']);
Route::post('/timesheets/{user_id}/send', [TimesheetController::class, 'sendPendingForUser']);
Route::post('/timesheet/store', [TimesheetController::class, 'store']);
Route::put('/timesheet/{id}/update', [TimesheetController::class, 'update']);
Route::put('timesheets/{id}/approve', [TimesheetController::class, 'approveTimesheet']);
Route::post('/timesheets/approve', [TimesheetController::class, 'approveTimesheetsForUser']);
Route::delete('/timesheet/{id}/destroy', [TimesheetController::class, 'destroy']);

//publication
Route::post('/posts/store', [PostController::class, 'store']);
Route::get('/posts/all', [PostController::class, 'postAll']);
Route::get('/posts/published', [PostController::class, 'getPublishedPosts']);
Route::get('/posts/{post}/getInfo', [PostController::class, 'show']);
Route::put('/posts/{postId}/update', [PostController::class, 'update']);
Route::delete('/posts/{postIs}/delete', [PostController::class, 'destroy']);

//commentaire (publication)
Route::get('/comments/{post}/all', [CommentController::class, 'index']);
Route::get('/comments/{comment}/getInfo', [CommentController::class, 'getInfoComment']);
Route::post('/posts/{post}/comments', [CommentController::class, 'store']);
Route::put('/comments/{comment}/update', [CommentController::class, 'update']);
Route::delete('/comments/{comment}/delete', [CommentController::class, 'destroy']);

//reaction (publication)
Route::get('/react/{postId}/getReactionCount', [ReactionController::class, 'getReaction']);
Route::post('react/{postId}', [ReactionController::class, 'react']);
Route::delete('react/{userId}/{postId}', [ReactionController::class, 'removeReaction']);

//groupe publication
Route::post('/groups/posts', [GroupPostController::class, 'store']);
Route::get('/groups/{id}/posts', [GroupPostController::class, 'postsByGroup']);
Route::get('/getMembersGroup/{groupId}', [GroupPostController::class, 'getMembers']);
Route::get('/users/{userId}/groups', [GroupPostController::class, 'groupsByUser']);
Route::put('/groups/{groupId}/rename', [GroupPostController::class, 'updateName']);
Route::post('/groups/{groupId}/add-members', [GroupPostController::class, 'addMembers']);
Route::delete('/groups/{groupId}/members/{userId}/remove', [GroupPostController::class, 'removeMember']);
Route::delete('/groups/{groupId}', [GroupPostController::class, 'destroy']);

//Filtre
Route::get('fliter/{mois_avant}/{mois_apres}/{recherche}');

//Message
Route::get('/messages/{user1}/{user2}', [MessageController::class, 'getConversation']);
Route::post('/messages', [MessageController::class, 'store']);
Route::post('/messages/{id}/read', [MessageController::class, 'markAsRead']);
Route::prefix('group-messages')->controller(GroupMessageController::class)->group(function () {
    Route::get('/getGroup/{groupId}', 'getGroup');
    Route::get('/messages/{groupId}', 'index');
    Route::post('/{groupId}', 'store');
});

//Groupe Message
Route::get('/message-groups/{group}/info', [GroupController::class, 'getGroupInfo']);
Route::get('/message-groups/{group}/members', [GroupController::class, 'getMembers']);
Route::get('/users/{userId}/message-groups', [GroupController::class, 'getUserGroups']);
Route::post('/message-groups', [GroupController::class, 'store']);
Route::post('/message-groups/{group}/add-users', [GroupController::class, 'addUsers']);
Route::post('/message-groups/{group}/remove-user', [GroupController::class, 'removeUser']);
Route::post('/message-groups/{group}/leave', [GroupController::class, 'leaveGroup']);
Route::put('/message-groups/{group}', [GroupController::class, 'update']);
Route::delete('/message-groups/{group}', [GroupController::class, 'destroy']);

Route::get('/messages/{id}/getMessage/message', [MessageController::class, 'getMessage']);
Route::delete('/messages/{id}/delete', [MessageController::class, 'destroy']);
Route::put('/messages/{id}/update', [MessageController::class, 'update']);
Route::put('/messages/{id}/read', [MessageController::class, 'markAsRead']);
Route::get('/groups/not/{id}', [GroupMessageController::class, 'getLeftUsers']);

//Conversation
// Route::get('/conversations/{user_id}', [ConversationController::class, 'getConversation']);
Route::get('/conversations/{user_id}', [ConversationController::class, 'myConversations']);
Route::get('/conversations/{conversationId}/getConversation', [ConversationController::class, 'getConversationInfo']);


//Auth Pusher
Route::middleware('auth:api')->post('/pusher/auth', function (Request $request) {
    return Broadcast::auth($request);
});

//notifications
Route::get('/notifications/{userId}', [NotificationController::class, 'getUserNotifications']);
Route::post('/notifications/read/{notificationId}', [NotificationController::class, 'markAsRead']);
Route::post('/report-error', [ErrorController::class, 'report']);
Route::get('/admin/error-reports', [NotificationController::class, 'getAdminErrorReports']);
Route::post('/notifications/{id}/read', [NotificationController::class, 'markErrorAsRead']);
Route::delete('/notification/{notificationId}/delete', [NotificationController::class, 'deleteNotification']);

//event
Route::get('event/get', [EventController::class, 'getEvent']);
Route::get('event/{eventId}/info', [EventController::class, 'getEventInfo']);
Route::post('event/create', [EventController::class, 'store']);
Route::put('event/update/{event_id}', [EventController::class, 'update']);
Route::delete('event/delete/{event_id}', [EventController::class, 'destroy']);
