<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class /* `ResetPasswordMail` is a Mailable class in Laravel used for sending an email to a user for
resetting their password. It accepts the reset password URL and the user information as
parameters during its construction. The `build` method is used to define the email subject and
the view that will be rendered when the email is sent. */
ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $url;
    public $user;

    /**
     * Create a new message instance.
     */
    public function __construct($url, $user)
    {
        $this->url = $url;
        $this->user = $user;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Réinitialisation de votre mot de passe')
            ->view('emails.reset-password');
    }
}
