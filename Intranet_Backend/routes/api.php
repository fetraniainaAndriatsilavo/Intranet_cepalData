<?php

use App\Http\Controllers\API\GroupController;
use App\Http\Controllers\API\GroupMessageController;
use App\Http\Controllers\API\MessageController;
use App\Http\Controllers\Api\PostController;
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
use App\Http\Controllers\PayrollRecordController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ReferenceDataController;
use App\Http\Controllers\SprintController;
use App\Http\Controllers\TaskController;
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



//UserController
// Route::get('/notifications', [UserController::class, 'getNotifications']);
// Route::get('/v1/users', [UserController::class, 'getUser']);
// Route::get('/v1/user/{id}', [UserController::class, 'getPersonalUser']);
// Route::post('v1/users/{id}', [UserController::class, 'toggleStatus']);
// Route::get('/all-manager', [UserController::class, 'getAllManagers']);

//PayrollRecordController
Route::post('/payroll-records', [PayrollRecordController::class, 'store']);
Route::get('/payroll-records/user/{userId}', [PayrollRecordController::class, 'getUserPayroll']);

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

Route::get('/documents/type', [DocumentsAdminController::class, 'doc_type']);
Route::post('/documents-admin/upload', [DocumentsAdminController::class, 'upload']);
Route::get('/documents/user/{userId}', [DocumentsAdminController::class, 'getUserDocuments']);

Route::get('/messages/{user1}/{user2}', [MessageController::class, 'getConversation']);

Route::post('/messages', [MessageController::class, 'store']);

Route::post('/messages/{id}/read', [MessageController::class, 'markAsRead']);

Route::prefix('groups')->group(function () {
    Route::get('/', [GroupController::class, 'index']);
    Route::post('/', [GroupController::class, 'store']);
    Route::get('/{id}', [GroupController::class, 'getUserGroups']);
    Route::post('/{groupId}/add-user', [GroupController::class, 'addUserToGroup']);
    Route::delete('/remove/{id}', [GroupController::class, 'deleteGroup']);
});

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

Route::post('/leave-requests', [LeaveRequestController::class, 'store']);
Route::get('/users/{id}/leave-balances', [LeaveRequestController::class, 'getLeaveBalances']);
Route::get('manager/{managerId}/leave-requests', [LeaveRequestController::class, 'getTeamLeaveRequests']);
Route::get('/all-requests', [LeaveRequestController::class, 'getAllLeaveRequests']);



Route::put('/leave-requests/{id}/approved', [LeaveRequestController::class, 'approvedStatus']);
Route::put('/leave-requests/{id}/refused', [LeaveRequestController::class, 'refusedStatus']);


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

Route::post('/posts/create', [PostController::class, 'store']);
Route::put('/posts/{id}/approved', [PostController::class, 'approvedPost']);
Route::get('/posts/all/published', [PostController::class, 'getAllPostsPublished']);
Route::get('/posts/all/pending', [PostController::class, 'getAllPostsPending']);
Route::get('/posts/user/{userId}', [PostController::class, 'getUserPosts']);
Route::delete('/posts/{id}/refused', [PostController::class, 'refusePost']);





//reaction
Route::post('/posts/{postId}/react', [PostController::class, 'reactToPost']);
Route::get('/posts/{id}/getReact', [PostController::class, 'getReact']);


//comments 
Route::post('/posts/{postId}/comment', [PostController::class, 'commentToPost']);
Route::get('/posts/{id}/getCommentCount', [PostController::class, 'getCommentCount']);
Route::get('/posts/{id}/getComment', [PostController::class, 'getComment']);
Route::put('/posts/{postId}/modify', [PostController::class, 'updatePost']);
Route::get('/posts/{id}/getOnePost', [PostController::class, 'getOnePost']);
Route::get('/comments/{id}/getOneComment', [PostController::class, 'getOneComment']);
Route::put('/comments/{commentId}/modify', [PostController::class, 'updateComment']);
Route::delete('/comments/{commentId}/delete', [PostController::class, 'destroyComment']);

//notifications
Route::get('/notifications/{userId}', [NotificationController::class, 'getUserNotifications']);
Route::post('/notifications/read/{notificationId}', [NotificationController::class, 'markAsRead']);
Route::post('/report-error', [ErrorController::class, 'report']);
Route::get('/admin/error-reports', [NotificationController::class, 'getAdminErrorReports']);
Route::post('/notifications/{id}/read', [NotificationController::class, 'markErrorAsRead']);
Route::delete('/notification/{notificationId}/delete', [NotificationController::class, 'deleteNotification']);


//groupe publication
Route::post('/groups_posts', [GroupPostController::class, 'store']);
Route::get('/group_posts/{id}/posts', [GroupPostController::class, 'postsByGroup']);
Route::get('/getMembersGroup/{groupId}', [GroupPostController::class, 'getMembers']);
Route::get('/users/{userId}/groups', [GroupPostController::class, 'groupsByUser']);
Route::put('/groups/{groupId}/rename', [GroupPostController::class, 'updateName']);
Route::delete('/groups/{groupId}/members/{userId}', [GroupPostController::class, 'removeMember']);
Route::delete('/groups/{groupId}', [GroupPostController::class, 'destroy']);

//event
Route::post('event/create', [EventController::class, 'store']);
Route::delete('event/delete/{event_id}', [EventController::class, 'destroy']);
Route::get('event/get', [EventController::class, 'getEvent']);

//FT
Route::post('/feuilles_de_temps/create', [FeuilleDeTempsController::class, 'store']);
Route::put('/feuilles_de_temps/{id}/update', [FeuilleDeTempsController::class, 'update']);
Route::get('/feuilles_de_temps/getByManager/{managerId}', [FeuilleDeTempsController::class, 'getSessionsByManager']);
Route::get('/sessions/getUser/{userId}', [FtPeriodeController::class, 'getSessionByUser']);
Route::get('/sessions/fromManager/{managerId}', [FtPeriodeController::class, 'getAllSessionsByManager']);
Route::get('/feuilles_de_temps/getByUser/{userId}/{periodeId}', [FeuilleDeTempsController::class, 'getByUserAndPeriode']);
Route::post('/session/create', [FtPeriodeController::class, 'store']);
Route::put('/sessions/{id}/update', [FtPeriodeController::class, 'update']);
Route::get('/sessions/backOffice/', [FtPeriodeController::class, 'getAllSessionsBackOffice']);
Route::get('/feuilles_de_temps/getFormBackOffice/{userId}/{periodeId}', [FeuilleDeTempsController::class, 'getFeuileFromBackOffice']);
Route::get('/sessions/getSession/{sessionId}', [FtPeriodeController::class, 'getSessionById']);
Route::post('/change-password/{userId}', [UserController::class, 'changePassword']);


Route::get('/getSoldeUtilisateur', [LeaveBalanceController::class, 'getSoldeAll']);
