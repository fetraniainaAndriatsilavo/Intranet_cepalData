import { useContext, useEffect, useState } from "react";
import SocialNavbar from "../Components/SocialNavbar";
import CreateEvent from "../Events/CreateEvent";
import Events from "../Events/Events";
import { AppContext } from "../../../Context/AppContext";
import axios from "axios";
import NotificationCard from "./NotificationCard";

export default function NotificationPage() {
    const { user } = useContext(AppContext)
    const [notificationCount, setNotificationCount] = useState(0)
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/notifications/' + user.id)
            .then((response) => {
                console.log(response)
                setNotifications(response.data)
                setNotificationCount(response.data.length)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [user]);

    return <div className="w-full">
        <SocialNavbar> </SocialNavbar>
        <div className="flex gap-6 w-full p-3 items-center justify-center">
            <div className="flex-col p-2 bg-white overflow-y-auto">
                <h1 className="font-semibold items-center text-lg mb-3 border-b-1"> Votre boîte de Notifications  <span className="text-white rounded-full bg-red-500 p-2 py-0"> {notificationCount} </span></h1>
                {notifications.length > 0 ? notifications.map((notification, key) => (
                    <NotificationCard key={key} notification={notification} />
                )) : <span className="text-sm text-center flex items-center justify-center italic mt-3 mb-3">
                    Aucune notifications pour l'instant
                </span>} 
                <button className="w-full bg-sky-50 text-sky-500 py-2 cursor-pointer" 
                    onClick={(e) => {
                        e.preventDefault() 
                        axios.delete('http://127.0.0.1:8000/api/')
                        .then(()=> { 
                            window.location.reload() 
                        })
                        .catch(() => {
                            alert('non supprimée')
                        })
                    }}
                > Tout marquer comme lue </button>
            </div>
        </div>
    </div>
}