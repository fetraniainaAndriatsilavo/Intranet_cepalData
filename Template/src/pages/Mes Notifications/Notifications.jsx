import { Pagination } from "@mui/material";
import CardNotification from "../../components/Mes Notifications/CardNotification";
import { useContext, useEffect, useState } from "react";
import api from "../../components/axios";
import { AppContext } from "../../context/AppContext";

export default function Notifications() {
    const [allNotifications, setAllNotifications] = useState([])
    const { user } = useContext(AppContext)

    const [currentPage, setCurrentPage] = useState(1);
    const userPerPage = 5;
    const lastPageIndex = Math.ceil(allNotifications.length / userPerPage);
    const [currentView, setCurrentView] = useState([])

    const handleChange = (event, value) => {
        setCurrentPage(value);
        setCurrentView(allNotifications.slice((value * userPerPage) - userPerPage, value * userPerPage))
    };

    const fetchNotifications = (id) => {
        api.get('/notifications/' + id)
            .then((response) => {
                setAllNotifications(response.data)
            })
    }

    useEffect(() => {
        fetchNotifications(user.id)
    }, [user])

    useEffect(() => {
        const startIndex = (currentPage - 1) * userPerPage;
        const endIndex = startIndex + userPerPage;
        setCurrentView(allNotifications.slice(startIndex, endIndex));
    }, [allNotifications, currentPage]);

    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold"> Mes Notifications </h1>
        </div>
        <div className="bg-white  w-1/2 rounded-lg">
            <h3 className="p-3 "> Tous mes notifications non lues  <span className={`${allNotifications && allNotifications.length > 0 ? 'text-white bg-red-500 p-0.5 rounded' : 'text-gray-400 '} font-semibold `}> {allNotifications && allNotifications.length} </span> </h3>
            {currentView.map((notification, index) => (
                <CardNotification key={index} notification={notification} fetchNotifications={fetchNotifications} />
            ))}
        </div>
        <div>
            <Pagination count={lastPageIndex} page={currentPage} onChange={handleChange} />
        </div>
    </div>
}