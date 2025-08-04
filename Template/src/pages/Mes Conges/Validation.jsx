import { Pagination } from "@mui/material";
import Table from "../../components/Conges/Table";
import { useEffect, useState } from "react";
import api from "../../components/axios";

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
    const [demandes, setDemandes] = useState([]) 

    const [currentPage, setCurrentPage] = useState(1);
    const userPerPage = 10;
    const lastPageIndex = Math.ceil(demandes.length / userPerPage);
    const [currentView, setCurrentView] = useState([])

    const handleChange = (event, value) => {
        setCurrentPage(value);
        setCurrentView(demandes.slice((value * userPerPage) - 10, value * userPerPage))
    }; 

    useEffect(() => {
        api.get('/all-requests')
            .then((response) => {
                setDemandes(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, []) 

    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold"> Validation des Congés </h1>
        </div>
        <div className="bg-white  w-full rounded-lg">
            <h3 className="p-3 "> Demandes de congé en attente de validation <span className=" font-semibold text-gray-300"> {demandes.length} </span> </h3>
            <Table datas={currentView.length < 1 ? demandes.slice(0, 10) : currentView} listHeader={listMenu} type="validation"/>
        </div>
        <div>
            <Pagination count={lastPageIndex} page={currentPage} onChange={handleChange} />
        </div>
    </div>
}