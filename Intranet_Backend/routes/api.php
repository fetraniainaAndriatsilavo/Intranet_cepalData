<?php

use App\Http\Controllers\API\GroupController;
use App\Http\Controllers\API\GroupMessageController;
use App\Http\Controllers\API\MessageController;
use App\Http\Controllers\AuthController;
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

// Route::middleware('auth:sanctum')->get('/user', [UserController::class, 'getUser']);
// Route::get(
//     '/ping',
//     function () {
//         return response()->json('ok');
//     }
// );
//AuthController
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/positions', [PositionController::class, 'store']);




Route::post('/v1/auth', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/data', [ReferenceDataController::class, 'getDataUser']);
Route::get('/user/{id}/info', [UserController::class, 'GetInfoUser']);
Route::put('/user/{id}/update', [UserController::class, 'update']);
Route::get('/getUser/all', [UserController::class, 'GetAllUsers']);

Route::post('/projects/store', [ProjectController::class, 'store']);
Route::put('/projects/{id}/status', [ProjectController::class, 'updateStatus']);
Route::get('/getProject/{userId}', [ProjectController::class, 'getProjectByUserId']);

Route::put('/projects/{id}/update', [ProjectController::class, 'updateProject']);
Route::delete('/projects/{id}/delete', [ProjectController::class, 'destroy']);
Route::get('/projects/{id}/getProject', [ProjectController::class, 'getProjectById']);

Route::post('/leave-requests', [LeaveRequestController::class, 'store']);
Route::get(
    '/type/leave',
    [LeaveRequestController::class, 'getAllTypeLeave']
);
Route::get('/users/{id}/leave-balances', [LeaveRequestController::class, 'getLeaveBalances']);
Route::get('manager/{managerId}/leave-requests', [LeaveRequestController::class, 'getTeamLeaveRequests']);
Route::get('/all-requests', [LeaveRequestController::class, 'getAllLeaveRequests']);
Route::put('/leave-requests/{id}/change', [LeaveRequestController::class, 'changeStatus']);



Route::get('/documents/type', [DocumentsAdminController::class, 'doc_type']);
Route::post('/documents-admin/upload', [DocumentsAdminController::class, 'upload']);
Route::get('/documents/user/{userId}', [DocumentsAdminController::class, 'getUserDocuments']);
Route::put('/document/{id}/changeStatus', [DocumentsAdminController::class, 'changeStatus']);

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



// Route::apiResource('posts', PostController::class);
Route::post('/posts/store', [PostController::class, 'store']);
Route::get('/posts/all', [PostController::class, 'postAll']);
Route::get('/posts/published', [PostController::class, 'getPublishedPosts']);
Route::get('/posts/{post}/getInfo', [PostController::class, 'show']);
Route::put('/posts/{postId}/update', [PostController::class, 'update']);
Route::delete('/posts/{postIs}/delete', [PostController::class, 'destroy']);

//groupe publication
Route::post('/groups/posts', [GroupPostController::class, 'store']);
Route::get('/groups/{id}/posts', [GroupPostController::class, 'postsByGroup']);
Route::get('/getMembersGroup/{groupId}', [GroupPostController::class, 'getMembers']);
Route::get('/users/{userId}/groups', [GroupPostController::class, 'groupsByUser']);
Route::put('/groups/{groupId}/rename', [GroupPostController::class, 'updateName']);
Route::post('/groups/{groupId}/add-members', [GroupPostController::class, 'addMembers']);
Route::delete('/groups/{groupId}/members/{userId}/remove', [GroupPostController::class, 'removeMember']);
Route::delete('/groups/{groupId}', [GroupPostController::class, 'destroy']);


//UserController
// Route::get('/notifications', [UserController::class, 'getNotifications']);
// Route::get('/v1/users', [UserController::class, 'getUser']);
// Route::get('/v1/user/{id}', [UserController::class, 'getPersonalUser']);
Route::put('v1/users/{id}', [UserController::class, 'toggleStatus']);
// Route::get('/all-manager', [UserController::class, 'getAllManagers']);



Route::get('fliter/{mois_avant}/{mois_apres}/{recherche}');

Route::get('v1/personal/{id}', [UserController::class, 'personal']);

Route::get('v1/checkers/{id}', function ($id) {
    $user = User::where('id', $id)->first();
    if (!$user) {
        return response()->json(['message' => 'Utilisateur non trouvé'], 404);
    } else {
        return response()->json(['role' => $user->role]);
    }
});

Route::get('v1/modify/{id}', [UserController::class, 'personal']);



Route::post('/forgot-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);
    try {
        $status = Password::sendResetLink($request->only('email'));
        return response()->json(['message' => __($status)]);
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




Route::get('/messages/{user1}/{user2}', [MessageController::class, 'getConversation']);

Route::post('/messages', [MessageController::class, 'store']);

Route::post('/messages/{id}/read', [MessageController::class, 'markAsRead']);


Route::prefix('group-messages')->controller(GroupMessageController::class)->group(function () {
    Route::get('/getGroup/{groupId}', 'getGroup');
    Route::get('/messages/{groupId}', 'index');
    Route::post('/{groupId}', 'store');
});

Route::get('/groups/users/{id}', [GroupMessageController::class, 'getGroupUsers']);
Route::delete('/groups/{groupId}/users/{userId}', [GroupMessageController::class, 'removeUserFromGroup']);
Route::post('/groups/{groupId}/leave', [GroupMessageController::class, 'leaveGroup']);
Route::get('/messages/{id}/getMessage/message', [MessageController::class, 'getMessage']);
Route::delete('/messages/{id}/delete', [MessageController::class, 'destroy']);
Route::put('/messages/{id}/update', [MessageController::class, 'update']);
Route::put('/messages/{id}/read', [MessageController::class, 'markAsRead']);

Route::get('/conversations/{user_id}', [ConversationController::class, 'getConversation']);

Route::get('/groups/not/{id}', [GroupMessageController::class, 'getLeftUsers']);


Route::middleware('auth:api')->post('/pusher/auth', function (Request $request) {
    return Broadcast::auth($request);
});




Route::get('/ogc-cumul', [OgCumulController::class, 'getAllCumuls']);
Route::get('/ogc-cumul/{userId}', [OgCumulController::class, 'getCumulByUserId']);


Route::get('/insert-approved-requests', [LeaveRequestController::class, 'insertApprovedRequestsIntoOgCumul']);

Route::get('manager/{managerId}/userCumul', [LeaveRequestController::class, 'getTeamCumul']);


Route::patch('/conges/ajouter-solde', [LeaveBalanceController::class, 'ajouterSoldeMensuel']);



Route::post('/sprints', [SprintController::class, 'store']);
Route::get('/getSprint/{sprintId}', [SprintController::class, 'getSprintById']);
Route::put('/sprints/{id}/update', [SprintController::class, 'updateSprint']);
Route::delete('/sprints/{id}/delete', [SprintController::class, 'destroy']);
Route::get('/sprints/{id}/getSprint', [SprintController::class, 'getOneSprintById']);

Route::post('/taches', [TaskController::class, 'store']);
Route::put('/taches/{id}/status', [TaskController::class, 'updateStatus']);
Route::get('/getTaches/{projectId}', [TaskController::class, 'getByProject']);
Route::put('/taches/{id}/update', [TaskController::class, 'updateTache']);
Route::get('/taches/{id}/getTache', [TaskController::class, 'getTacheById']);
Route::delete('/taches/{id}/delete', [TaskController::class, 'destroy']);









//notifications
Route::get('/notifications/{userId}', [NotificationController::class, 'getUserNotifications']);
Route::post('/notifications/read/{notificationId}', [NotificationController::class, 'markAsRead']);
Route::post('/report-error', [ErrorController::class, 'report']);
Route::get('/admin/error-reports', [NotificationController::class, 'getAdminErrorReports']);
Route::post('/notifications/{id}/read', [NotificationController::class, 'markErrorAsRead']);
Route::delete('/notification/{notificationId}/delete', [NotificationController::class, 'deleteNotification']);




//event
Route::post('event/create', [EventController::class, 'store']);
Route::delete('event/delete/{event_id}', [EventController::class, 'destroy']);
Route::get('event/get', [EventController::class, 'getEvent']);


Route::post('/change-password/{userId}', [UserController::class, 'changePassword']);


Route::get('/getSoldeUtilisateur', [LeaveBalanceController::class, 'getSoldeAll']);
