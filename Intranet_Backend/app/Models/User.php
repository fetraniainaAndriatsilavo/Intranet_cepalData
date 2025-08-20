<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Mail\ResetPasswordMail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Notifications\Notification as NotificationsNotification;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;


    protected $connection = 'intranet_extedim';
    protected $table = "users";

    protected $fillable = [
        'email',
        'password',
        'status',
        'last_login',
        'role',
        'first_name',
        'last_name',
        'position_id',
        'hire_date',
        'department_id',
        'birth_date',
        'birth_place',
        'employee_number',
        'cnaps_number',
        'phone_number',
        'address',
        'class_id',
        'image',
        'client_code',
        'manager_id',
        'leaving_date',
        'updated_by',
        'leaving_reason',
        'gender',
        'marital_status',
        'ogc_leav_bal_init',
        'ogc_leav_bal_init_date',
        'ogc_leav_bal',
        'ogc_leav_bal_date',
        'ogc_perm_bal',
        'ogc_perm_bal_date',
        'ogc_othr_bal',
    ];


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function sendPasswordResetNotification($token)
    {
        $url = url('http://localhost:5173/changepswd/' . $token . '/' . $this->email);
        Mail::to($this->email)->send(new ResetPasswordMail($url, $this));
    }


    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }


    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_user');
    }


    public function groupPosts()
    {
        return $this->belongsToMany(GroupPost::class, 'posts_groups_users', 'user_id', 'group_id')
            ->withTimestamps()
            ->withPivot('joined_at', 'role');
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function teamMembers()
    {
        return $this->hasMany(User::class, 'manager_id');
    }


    public function classification()
    {
        return $this->belongsTo(Classification::class, 'class_id');
    }

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_code', 'code');
    }
    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function documents()
    {
        return $this->hasMany(DocumentAdmin::class, 'user_id');
    }
}
