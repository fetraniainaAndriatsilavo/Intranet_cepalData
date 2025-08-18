import { Pagination } from "@mui/material";
import Table from "../../components/Conges/Table";
import { useEffect, useState } from "react";
import api from "../../components/axios";

export default function ListeConges() {

    const listMenu = [
        "Identifiant",
        "Solde de congés",
        "Motif de la demande",
        "Date de début",
        "Date de fin",
        "Délai",
        "Date de soumission",
        "Statut de la demande"
    ];

    const [list, setList] = useState([])
    useEffect(() => {
        api.get('/all-requests')
            .then((response) => {
                setList(response.data); 
                // .filter((demande) => demande.status !== 'created')
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

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
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold"> Historiques des Congés </h1>
        </div>
        <div className="bg-white  w-full rounded-lg">
            <h3 className="p-3 "> Tous les demandes <span className=" font-semibold text-gray-300"> {list.length} </span> </h3>
            <Table listHeader={listMenu} datas={currentView.length < 1 ? list.slice(0, 10) : currentView} type='historic' />
        </div>
        <div>
            <Pagination count={lastPageIndex} page={currentPage} onChange={handleChange} />
        </div>
    </div>
}