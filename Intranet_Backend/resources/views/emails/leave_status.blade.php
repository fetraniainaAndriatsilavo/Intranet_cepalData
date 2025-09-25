<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mise à jour de votre demande de congé</title>
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

        .status-approved {
            color: green;
            font-weight: bold;
        }

        .status-refused {
            color: red;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="container">
        <img src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/lykrscrn/y0n/eac/fc1/image005%20%281%29.png"
            alt="CepalData Logo" class="logo">
        <h2> Mise à jour de votre demande de congé </h2>
        <p>Bonjour {{ $user->first_name }},</p>
        @php
        $statusLabels = [
        'approved' => 'Approuvé',
        'refused' => 'Refusé',
        ];

        $statusText = $statusLabels[$leaveRequest->status] ?? ucfirst($leaveRequest->status);
        @endphp

        <p>Votre demande de congé du <strong>{{ $leaveRequest->start_date }}</strong> au
            <strong>{{ $leaveRequest->end_date }}</strong> a été
            <strong class="status-{{ strtolower($leaveRequest->status) }}">{{ $statusText }}</strong>.
        </p>


        @if(!empty($leaveRequest->approved_comment))
        <p>Commentaire :</p>
        <div class="reason-box">
            "{{ $leaveRequest->approved_comment }}"
        </div>
        @endif

        <p>Pour toute précision, merci de contacter votre manager ou le service RH.</p>

        <p>Merci,</p>
        <p>L'équipe RH</p>
    </div>
</body>

</html>