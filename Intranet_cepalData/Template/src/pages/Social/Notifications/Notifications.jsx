import axios from "axios";
import Bell from "../../../Icons/icones/bell(1).png";
import NotificationLists from "./NotificationLists"; 
import { useState, useEffect, useContext } from "react"; 
import { AppContext } from "../../../Context/AppContext";


export default function Notifications() { 
  const {user} = useContext(AppContext);
  const [notificationCount, setNotificationCount] = useState(0)
  const [open, setOpen] = useState(false) 
  const [notifications, setNotifications] = useState([]) 
 
  useEffect(() => { 
    axios.get('http://127.0.0.1:8000/api/notifications/'+user.id)
    .then((response) => { 
        console.log(response)
        setNotifications(response.data) 
        setNotificationCount(response.data.length)
    })
    .catch((error) => { 
        console.log(error)
    })
  }, [user]); 

  return (
    <div className="relative">
      <button
        className="items-center flex justify-center relative cursor-pointer"
        onClick={() => {
          if (open == true) {
            setOpen(false); 
            setNotificationCount(0)
          } else {
            setOpen(true);
          }
        }}
      >
        <div className="relative">
          <img src={Bell} className="w-8 h-8" alt="notifications" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </div>
      </button>
      {open && notifications.length > 0 && <NotificationLists notification={notifications}> </NotificationLists>}
    </div>
  );
}
