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

class Contrat extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory,  HasApiTokens;


    protected $connection = 'intranet_extedim';
    protected $table = "contracts_type";

    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'leave',
        'updated_at',
        'updated_by',
        'code'
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
