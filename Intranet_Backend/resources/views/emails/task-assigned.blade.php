<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Nouvelle tâche assignée</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f8f9fa;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 10px;
            text-align: center;
        }

        .logo {
            max-width: 200px;
            margin-bottom: 10px;
        }

        .task-box {
            margin: 20px auto;
            padding: 15px;
            background-color: #e9f7ef;
            border: 1px solid #c3e6cb;
            border-radius: 8px;
            font-size: 15px;
            text-align: left;
        }

        .button {
            display: inline-block;
            width: 250px;
            background-color: #007bff;
            color: white !important;
            text-align: center;
            padding: 12px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 15px;
        }
    </style>
</head>

<body>
    <div class="container">
        <img src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/lykrscrn/y0n/eac/fc1/image005%20%281%29.png"
            alt="CepalData Logo" class="logo">

        <h2>Objet : Nouvelle tâche assignée</h2>

        <p>Bonjour {{ $user->first_name }},</p>

        <div class="task-box">
            <p>Vous avez été rattaché à la tâche :</p>
            <p><strong>{{ $task->title }}</strong></p>
            @if($project)
            <p><strong>Projet :</strong> {{ $project->name }}</p>
            @endif
        </div>

        <p>
            Nous vous invitons à vérifier vos tâches assignées dès que possible.
        </p>

        <p>Merci,</p>
        <p>L'équipe RH</p>
    </div>
</body>

</html>