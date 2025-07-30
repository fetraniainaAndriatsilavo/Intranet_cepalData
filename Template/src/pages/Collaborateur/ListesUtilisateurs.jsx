import { Pagination } from "@mui/material";
import TableUser from "../../components/Collaborateurs/TableUser";
import { useState } from "react";

export default function ListesUtilisateurs() {
    const headers = [
        'Profile',
        'Email',
        'Poste',
        'Département',
        'Date d\'embauche',
        'Action'
    ]
    const allUsers = [
        {
            profile: 'John Smith',
            email: 'john@example.com',
            poste: 'dev',
            department: 'IT',
            hire_date: 'yesterday'
        }
    ]

    for (let i = 0; i < 101; i++) {
        allUsers.push(
            {
                profile: 'John Smith',
                email: 'john@example.com',
                poste: 'dev',
                department: 'IT',
                hire_date: 'yesterday'
            }
        )
    }
    const [currentPage, setCurrentPage] = useState(1);
    const userPerPage = 10;
    const lastPageIndex = Math.ceil(allUsers.length / userPerPage);
    const [currentView, setCurrentView] = useState([])
    
    const handleChange = (event, value) => {
        setCurrentPage(value);
        setCurrentView(allUsers.slice((value * userPerPage) - 10, value * userPerPage))
    };

    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">

        <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold"> Les Collaborateurs </h1>
        </div>
        <div className="bg-white  w-full rounded-lg">
            <h3 className="p-3 "> Tous les Collaborateurs <span className="text-gray-400 font-semibold"> {allUsers ? allUsers.length : 0}  </span> </h3>
            <TableUser listHeader={headers} datas={currentView.length < 1 ? (allUsers.slice(0, 10)) : currentView} />
        </div>
        <div>
            <Pagination count={lastPageIndex} page={currentPage} onChange={handleChange} />
        </div>
    </div>
}