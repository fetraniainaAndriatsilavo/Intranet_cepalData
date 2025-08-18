import { useContext, useEffect, useState } from "react"
import Iconboy from "../../../Icons/icones/boy.png"
import { AppContext } from "../../../Context/AppContext"
import axios from "axios"
export default function NotificationCard({ notification }) {
    const { user } = useContext(AppContext)
    const [notifId, setNotifId] = useState(null)

    useEffect(() => {
        setNotifId(notification.id) 
    }, [notification])



    return <div className="w-full flex items-center p-4 gap-4 hover:bg-gray-100 rounded-md shadow-sm mb-2">
        <img
            src={Iconboy}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
        />

        <div className="flex-1">
            <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-600">{user.name}</span>, {notification.data.message}
            </p>
        </div>

        <button className="text-red-500 font-medium hover:cursor-pointer text-lg" id={notifId}
            onClick={(e) => {
                e.preventDefault()
                const payload = {
                    user_id: user.id
                }
                axios.delete('http://127.0.0.1:8000/api/notification/' + notifId + '/delete', {
                    data: payload
                },
                )
                    .then(() => {
                        alert('Notification supprimée') 
                        window.location.reload() 
                    })
                    .catch(() => {
                        alert('Notification non-supprimée')
                    })
            }}
        >
            X
        </button>
    </div>

}