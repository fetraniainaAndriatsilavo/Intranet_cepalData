import { Pagination } from "@mui/material";
import CardNotification from "../../components/Mes Notifications/CardNotification";
import { useState } from "react";

export default function Notifications() { 
    const [allNotifications, setAllNotifications] = useState([])  

    const [currentPage, setCurrentPage] = useState(1);
    const userPerPage = 5;
    const lastPageIndex = Math.ceil(allNotifications.length / userPerPage);
    const [currentView, setCurrentView] = useState([1,2,6])

    const handleChange = (event, value) => {
        setCurrentPage(value);
        setCurrentView(allNotifications.slice((value * userPerPage) - userPerPage, value * userPerPage))
    };

    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold"> Mes Notifications </h1>
        </div>
        <div className="bg-white  w-1/2 rounded-lg">
            <h3 className="p-3 "> Tous mes notifications <span className="text-gray-400 font-semibold"> 5 </span> </h3>
            <CardNotification />
            <CardNotification />
            <CardNotification />
            <CardNotification />
            <CardNotification />
        </div>
        <div>
            <Pagination count={lastPageIndex} page={currentPage} onChange={handleChange} />
        </div>
    </div>
}