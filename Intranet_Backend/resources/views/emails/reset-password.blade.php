<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de mot de passe</title>
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

        .link {
            color: red;
            word-wrap: break-word;
        }
    </style>
</head>

<body>
    <div class="container">
        <img src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/lykrscrn/y0n/eac/fc1/image005%20%281%29.png " alt="CepalData Logo" class="logo">
        <h2> Réinitialisation du mot de passe </h2>
        <p>Bonjour {{ $user->name }},</p>
        <p>Vous avez oublié votre mot de passe ?</p>
        <p>Nous avons reçu une demande de réinitialisation de mot de passe lié à votre compte.</p>
        <p>Pour modifier votre mot de passe, cliquez sur ce lien :</p>
        <p>
            <a href="{{ $url }}" class="button text-white">MODIFICATION MOT DE PASSE</a>
        </p>
        <p>Merci,</p>
        <p>L'équipe RH</p>
    </div>
</body>

</html>