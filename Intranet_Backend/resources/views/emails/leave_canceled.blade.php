<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Annulation de congé</title>
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

        .details-box {
            margin: 20px auto;
            padding: 15px;
            background-color: #fff3cd;
            border: 1px solid #ffeeba;
            border-radius: 8px;
            font-size: 15px;
            text-align: left;
        }

        .button {
            display: inline-block;
            width: 250px;
            background-color: #ffc107;
            color: black !important;
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
        <h2>Annulation d'une demande de congé</h2>
        <p>Bonjour,</p>
        <p>L'utilisateur <strong>{{ $user->first_name }} {{ $user->last_name }}</strong> a annulé sa demande de congé.</p>
        <div class="details-box">
            <p><strong>Dates :</strong> du {{ $leaveRequest->start_date }} au {{ $leaveRequest->end_date }}</p>
            @if(!empty($comment))
            <p><strong>Commentaire :</strong> {{ $comment }}</p>
            @endif
        </div>
        <p>Pour toute précision, merci de contacter l'utilisateur ou le service RH.</p>
        <p>Merci,</p>
        <p>L'équipe RH</p>
    </div>
</body>

</html>