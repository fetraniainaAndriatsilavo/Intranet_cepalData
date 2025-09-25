<?php

namespace App\Notifications;

use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskAssigned extends Notification
{
    use Queueable;

    protected $task;

    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    public function via($notifiable)
    {

        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Nouvelle tâche assignée')
            ->view('emails.task-assigned', [
                'user'   => $notifiable,
                'task'   => $this->task,
                'project' => $this->task->project,
            ]);
    }

    public function toDatabase($notifiable)
    {
        return [
            'task_id' => $this->task->id,
            'title' => $this->task->title,
            'project' => $this->task->project?->name,
            'message' => "Vous avez été rattaché à la tâche {$this->task->title} dans le projet {$this->task->project?->name}.",
        ];
    }
}
