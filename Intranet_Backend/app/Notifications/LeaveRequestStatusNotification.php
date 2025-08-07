<?
namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\DatabaseMessage;

class LeaveRequestStatusNotification extends Notification
{
    protected $leaveRequest;

    public function __construct($leaveRequest)
    {
        $this->leaveRequest = $leaveRequest;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Mise à jour de votre demande de congé',
            'message' => "Votre demande de congé du {$this->leaveRequest->start_date} au {$this->leaveRequest->end_date} a été {$this->leaveRequest->status}.",
            'request_id' => $this->leaveRequest->id
        ];
    }
}
