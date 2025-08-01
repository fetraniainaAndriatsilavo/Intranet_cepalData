<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeUserMail extends Mailable
{
    use SerializesModels;

    public $user;
    public $defaultPassword;

    public function __construct($user, $defaultPassword)
    {
        $this->user = $user;
        $this->defaultPassword = $defaultPassword;
    }

    public function build()
    {
        return $this->subject('Votre compte a été créé')
            ->markdown('emails.welcome-user');
    }
}
