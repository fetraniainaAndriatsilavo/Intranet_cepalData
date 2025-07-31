import { Pagination } from "@mui/material";
import Table from "../../components/Conges/Table";
import { useState } from "react";

export default function Validation() {
    const listMenu = [
        "Identifiant",
        "Solde ",
        "Motif",
        "Date de début",
        "Date de fin",
        "Nombre de jours ouvrés",
        "Date de soumission",
        "Actions disponibles"
    ];

    const listeDemande = [
        {
            user: {
                name: 'Hery Niaina'
            },
            reason: 'Vacances',
            start_date: '07/28/2025',
            end_date: '08/31/2025',
            request_type: 'leave',
            created_at: '25/07/2025'
        },
        {
            user: {
                name: 'Niaina'
            },
            reason: 'Vacances',
            start_date: '07/28/2025',
            end_date: '08/11/2025',
            request_type: 'leave',
            created_at: '25/07/2025'
        },
        {
            user: {
                name: 'Hery '
            },
            reason: 'Vacances',
            start_date: '07/28/2025',
            end_date: '08/01/2025',
            request_type: 'leave',
            created_at: '25/07/2025'
        },
        {
            user: {
                name: 'Hery '
            },
            reason: 'Vacances',
            start_date: '07/28/2025',
            end_date: '08/04/2025',
            request_type: 'leave',
            created_at: '25/07/2025'
        }
    ]

    const [currentPage, setCurrentPage] = useState(1);
    const userPerPage = 10;
    const lastPageIndex = Math.ceil(listeDemande.length / userPerPage);
    const [currentView, setCurrentView] = useState([])

    const handleChange = (event, value) => {
        setCurrentPage(value);
        setCurrentView(listeDemande.slice((value * userPerPage) - 10, value * userPerPage))
    };

    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold"> Validation des Congés </h1>
        </div>
        <div className="bg-white  w-full rounded-lg">
            <h3 className="p-3 "> Demandes de congé en attente de validation <span className=" font-semibold text-gray-300"> {listeDemande.length} </span> </h3>
            <Table datas={currentView.length < 1 ? listeDemande.slice(0, 10) : currentView} listHeader={listMenu} />
        </div>
        <div>
            <Pagination count={lastPageIndex} page={currentPage} onChange={handleChange} />
        </div>
    </div>
}