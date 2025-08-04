@component('mail::message')
# Bonjour {{ $user->first_name }},

Votre compte a été créé sur la plateforme intranet.

**Votre mot de passe temporaire est :** `{{ $defaultPassword }}`

Merci de le changer dès maintenant pour des raisons de sécurité.

@component('mail::button', ['url' => 'http://localhost:3000/settings'])
Changer mon mot de passe
@endcomponent

Merci de votre collaboration.

@endcomponent