import { Pagination, TextField } from "@mui/material";
import TableFeuille from "../../components/Mes Feuilles/TableFeuille";
import { useEffect, useState } from "react";

export default function AllTimesheet() {
    const header = [
        'Nom',
        'Dossier',
        'Présence (JH)',
        'Présence (h)',
        'Absence',
        "Congés",
        'Fériés',
        "Récuperation",
        "Repos Médical"
    ]
    const lists = [8, 9, 9, 9, 9, 9, 9, 9, 99, 9, 9, 9, 9, 9, 9, 9, 4, 4, 4, 4, 4, 66, 6, 6]
    // pagination du tableau
    const [currentPage, setCurrentPage] = useState(1);
    const userPerPage = 10;
    const lastPageIndex = Math.ceil(lists.length / userPerPage);
    const [currentView, setCurrentView] = useState([]);

    const handleChange = (event, value) => {
        setCurrentPage(value);
        setCurrentView(lists.slice((value * userPerPage) - 10, value * userPerPage));
    };

    useEffect(() => {
        const startIndex = (currentPage - 1) * userPerPage;
        const endIndex = currentPage * userPerPage;
        setCurrentView(lists.slice(startIndex, endIndex));
    }, [lists, currentPage]);

    // filtre par nom et role 
    const [searchUsers, setSearchUsers] = useState("");
    const filteredUsers = lists.filter((user) => {
        const name = user.first_name?.toLowerCase() || "";
        return (
            name.includes(searchUsers.toLowerCase())
        );
    });

    // pagination pour filtered users
    const lastFilteredPageIndex = Math.ceil(filteredUsers.length / userPerPage);
    const filteredView = filteredUsers.slice((currentPage - 1) * userPerPage, currentPage * userPerPage);

    // choisir laquelle  utilisateurs 
    const displayedUsers = searchUsers
        ? filteredView
        : currentView.length < 1
            ? lists.slice(0, 10)
            : currentView;

    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0 flex items-center justify-between w-full">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                Résumé du Feuille de Temps mensuel
            </h1>
            <TextField
                size="small"
                label='Filtrer par nom ou dossier'
                className="bg-white border-transparent rounded-lg text-gray-200"
                value={searchUsers}
                onChange={(e) => {
                    setSearchUsers(e.target.value);
                    setCurrentPage(1);
                }}
            />
        </div>
        <div className="bg-white w-full rounded-lg">
            <div className="bg-white w-full rounded-lg">
                <TableFeuille header={header} datas={displayedUsers} type={'admin'} />
            </div>
        </div>
        <div className="flex items-center justify-end w-full">
            <button className="underline text-green-500 rounded-lg cursor-pointer flex gap-1 items-center flex-row justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-file-type-xls">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
                    <path d="M4 15l4 6" />
                    <path d="M4 21l4 -6" />
                    <path d="M17 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75" />
                    <path d="M11 15v6h3" />
                </svg>   Exporter en xlsx
            </button>
        </div>
        <div>
            <Pagination
                count={searchUsers ? lastFilteredPageIndex : lastPageIndex}
                page={currentPage}
                onChange={handleChange}
            />
        </div>

    </div>
}