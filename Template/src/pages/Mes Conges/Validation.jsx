import { Pagination, TextField } from "@mui/material";
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

    // listes des demandes a valider 
    const [demandes, setDemandes] = useState([])
    useEffect(() => {
        api.get('/all-requests')
            .then((response) => {
                setDemandes(response.data.filter((demande) => demande.status === 'created'));
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    // pagination 
    const [currentPage, setCurrentPage] = useState(1);
    const userPerPage = 10;
    const lastPageIndex = Math.ceil(demandes.length / userPerPage);
    const [currentView, setCurrentView] = useState([])

    const handleChange = (event, value) => {
        setCurrentPage(value);
        setCurrentView(demandes.slice((value * userPerPage) - 10, value * userPerPage))
    };


    // filtre par nom, prénom d'utilisateur
    const [searchUsers, setSearchUsers] = useState("");

    const filteredUsers = demandes.filter((demande) => {
        const firstName = demande.user?.first_name?.toLowerCase() || "";
        const lastName = demande.user?.last_name?.toLowerCase() || "";
        return (
            firstName.includes(searchUsers.toLowerCase()) ||
            lastName.includes(searchUsers.toLowerCase())
        );
    });

    // pagination pour filtered users
    const lastFilteredPageIndex = Math.ceil(filteredUsers.length / userPerPage);
    const filteredView = filteredUsers.slice((currentPage - 1) * userPerPage, currentPage * userPerPage);

    // choisir laquelle  utilisateurs 
    const displayedUsers = searchUsers
        ? filteredView
        : currentView.length < 1
            ? demandes.slice(0, 10)
            : currentView;


    // reinitialise apres une validation 
    useEffect(() => {
        fetchDemandes()
    }, [])

    const fetchDemandes = () => {
        api.get('/all-requests')
            .then((response) => {
                setDemandes(response.data.filter((demande) => demande.status === 'created'));
            })
            .catch((error) => {
                console.log(error)
            });
    }; 

    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0 flex items-center justify-between w-full">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold"> Validation des Congés </h1>
            <TextField
                size="small"
                label='Rechercher par nom, prénom'
                className="bg-white border-transparent rounded-lg"
                value={searchUsers}
                onChange={(e) => {
                    setSearchUsers(e.target.value);
                    setCurrentPage(1);
                }}
            />
        </div>
        <div className="bg-white  w-full rounded-lg">
            <h3 className="p-3 "> Demandes de congé en attente de validation <span className=" font-semibold text-gray-300"> {searchUsers ? filteredUsers.length : demandes ? demandes.length : 0} </span> </h3>
            <Table datas={displayedUsers} listHeader={listMenu} type="validation" fetchDemandes={fetchDemandes}/>
        </div>
        <div>
            <Pagination count={lastPageIndex} page={currentPage} onChange={handleChange} />
        </div>
    </div>
}