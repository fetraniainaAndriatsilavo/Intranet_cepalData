import { useState } from "react"
import api from "../axios"

export default function CardNotification({ notification, fetchNotifications }) {
    const [loading, setLoading] = useState(0)

    const formatDate = (d) => {
        const mois = [
            "Jan",
            "Fév",
            "Mars",
            "Avr",
            "Mai",
            "Juin",
            "Juil",
            "Aout",
            "Sept",
            "Oct",
            "Nov",
            "Déc"
        ]
        const date = new Date(d)
        return mois[date.getMonth()] + ' ' + date.getDate() + ", " + date.getFullYear()
    }

    const MarkAsRead = (id, user_id) => {
        setLoading(1)
        api.post('/notifications/read/' + id, {
            user_id: user_id
        })
            .then(() => {
                setLoading(2)
            })
            .catch(() => {
                setLoading(3)
            })
            .finally(() => {
                setLoading(0)
                fetchNotifications(user_id)
            })
    }

    return <div className="p-3">
        <div className="flex items-center flex-row"> {
            notification.data.title ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-bell"><path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
            </svg> : ''
        }
            <h1 className="title font-bold p-1"> {notification.data.title ? notification.data.title : ''} </h1>
        </div>
        <p className="leading-5 p-3"> {notification.data.message ? notification.data.message : notification.data.content} </p>
        <div className="flex items-center flex-row justify-between">
            <button className="text-sky-600 p-3 cursor-pointer" onClick={(e) => {
                e.preventDefault()
                MarkAsRead(notification.id, notification.notifiable_id)
            }}>  {
                    loading == 0 ? 'Marquer comme lue' : loading == 1 ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-700 icon icon-tabler icons-tabler-outline icon-tabler-loader">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 6l0 -3" />
                        <path d="M16.25 7.75l2.15 -2.15" />
                        <path d="M18 12l3 0" />
                        <path d="M16.25 16.25l2.15 2.15" />
                        <path d="M12 18l0 3" />
                        <path d="M7.75 16.25l-2.15 2.15" />
                        <path d="M6 12l-3 0" />
                        <path d="M7.75 7.75l-2.15 -2.15" /></svg> : loading == 2 ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-green-500 icon icon-tabler icons-tabler-outline icon-tabler-bell-check">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M11.5 17h-7.5a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3c.016 .129 .037 .256 .065 .382" />
                            <path d="M9 17v1a3 3 0 0 0 2.502 2.959" />
                            <path d="M15 19l2 2l4 -4" />
                        </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-red-400 icon icon-tabler icons-tabler-outline icon-tabler-x">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M18 6l-12 12" />
                        <path d="M6 6l12 12" />
                    </svg>
                } </button>
            <span className="font-semibold text-gray-300"> {formatDate(notification.created_at)} </span>
        </div>
        <hr />
    </div>
    // 
}