<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue sur l’intranet</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }

        .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            text-align: center;
        }

        .logo {
            max-width: 200px;
            margin-bottom: 10px;
        }

        .button {
            display: inline-block;
            width: 200px;
            background-color: #007bff;
            color: white;
            text-align: center;
            padding: 12px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="container">
        <img src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/lykrscrn/y0n/eac/fc1/image005%20%281%29.png"
            alt="CepalData Logo" class="logo">
        <h2>Bienvenue sur l’intranet</h2>
        <p>Bonjour {{ $user->first_name }},</p>
        <p>Votre compte a été créé avec succès sur la plateforme intranet.</p>
        <p>Votre mot de passe temporaire est :</p>
        <p><strong>{{ $defaultPassword }}</strong></p>
        <p>Merci de le changer dès votre première connexion pour des raisons de sécurité.</p>
        <p>
            <a href="{{ $intranetUrl }}" class="button">SE CONNECTER</a>
        </p>
        <p>Merci,<br>L'équipe RH</p>
    </div>
</body>

</html>