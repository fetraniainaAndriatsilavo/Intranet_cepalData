import { Pagination } from "@mui/material";
import Tableau from "../../components/Gestion des Conges/Tableau";
import { useState } from "react";

export default function Etats() {
    const header = [
        "Identifiant",
        "Congés annuels",
        "Permissions exceptionnelles",
        "Autres absences"
    ];
    const list = [
        {
            username: 'user1'
        },
        {
            username: 'user2'
        },
        {
            username: 'user3'
        },
    ]

    const [currentPage, setCurrentPage] = useState(1);
    const userPerPage = 10;
    const lastPageIndex = Math.ceil(list.length / userPerPage);
    const [currentView, setCurrentView] = useState([])

    const handleChange = (event, value) => {
        setCurrentPage(value);
        setCurrentView(list.slice((value * userPerPage) - 10, value * userPerPage))
    };


    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold"> Soldes des personnelles</h1>
        </div>
        <div className="bg-white  w-full rounded-lg">
            <h3 className="p-3 "> Tous les soldes personnelles <span className=" font-semibold text-gray-300"> {list.length}</span> </h3>
            <Tableau header={header} datas={currentView.length < 1 ? (list.slice(0, 10)) : currentView} />
        </div>
        <div>
            <Pagination count={lastPageIndex} page={currentPage} onChange={handleChange} />
        </div>
    </div>
}