<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Nouvelle demande de congé</title>
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

        .reason-box {
            margin: 20px auto;
            padding: 15px;
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 8px;
            font-size: 15px;
            text-align: left;
        }

        .button {
            display: inline-block;
            width: 250px;
            background-color: #dc3545;
            color: white !important;
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
        <img src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/lykrscrn/y0n/eac/fc1/image005%20%281%29.png" alt="CepalData Logo" class="logo">
        <h2> Objet : Nouvelle demande de congé</h2>
        <p>Bonjour {{ $user->first_name }},</p>
        <p>
            Une nouvelle demande de congé a été enregistrée par
            <strong>{{ $author->first_name }} {{ $author->last_name }}</strong>.
        </p>
        <p>
            <strong>Période :</strong> {{ $period }}
        </p>

        <p>
            Nous vous invitons à consulter cette demande au sein de votre équipe.
        </p>

        <p>Merci,</p>
        <p>L'équipe RH</p>
    </div>
</body>

</html>