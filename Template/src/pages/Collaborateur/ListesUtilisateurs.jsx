import { Pagination, TextField } from "@mui/material";
import TableUser from "../../components/Collaborateurs/TableUser";
import { useEffect, useState } from "react";
import api from "../../components/axios";

export default function ListesUtilisateurs() {
    const headers = [
        'Profile',
        'Email',
        'Poste',
        'Département',
        'Date d\'embauche',
        'Action'
    ];

    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        api.get('/getUser/all')
            .then((response) => {
                setAllUsers(response.data.users);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // pagination du tableau
    const [currentPage, setCurrentPage] = useState(1);
    const userPerPage = 10;
    const lastPageIndex = Math.ceil(allUsers.length / userPerPage);
    const [currentView, setCurrentView] = useState([]);

    const handleChange = (event, value) => {
        setCurrentPage(value);
        setCurrentView(allUsers.slice((value * userPerPage) - 10, value * userPerPage));
    };

    useEffect(() => {
        const startIndex = (currentPage - 1) * userPerPage;
        const endIndex = currentPage * userPerPage;
        setCurrentView(allUsers.slice(startIndex, endIndex));
    }, [allUsers, currentPage]);

    // filtre par nom et role 
    const [searchUsers, setSearchUsers] = useState("");
    const filteredUsers = allUsers.filter((user) => {
        const name = user.first_name?.toLowerCase() || "";
        const email = user.email?.toLowerCase() || "";
        const role = user.role?.toLowerCase() || "";
        return (
            name.includes(searchUsers.toLowerCase()) ||
            email.includes(searchUsers.toLowerCase()) ||
            role.includes(searchUsers.toLowerCase())
        );
    });

    // pagination pour filtered users
    const lastFilteredPageIndex = Math.ceil(filteredUsers.length / userPerPage);
    const filteredView = filteredUsers.slice((currentPage - 1) * userPerPage, currentPage * userPerPage);

    // choisir laquelle  utilisateurs 
    const displayedUsers = searchUsers
        ? filteredView
        : currentView.length < 1
            ? allUsers.slice(0, 10)
            : currentView;

    return (
        <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">

            <div className="mb-4 sm:mb-0 flex items-center justify-between w-full">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                    Les Collaborateurs
                </h1>
                <TextField
                    size="small"
                    label='Rechercher par nom, role'
                    className="bg-white border-transparent rounded-lg"
                    value={searchUsers}
                    onChange={(e) => {
                        setSearchUsers(e.target.value);
                        setCurrentPage(1); 
                    }}
                />
            </div>

            <div className="bg-white w-full rounded-lg">
                <h3 className="p-3">
                    Tous les Collaborateurs{" "}
                    <span className="text-gray-400 font-semibold">
                        {searchUsers ? filteredUsers.length : allUsers ? allUsers.length : 0}
                    </span>
                </h3>
                <TableUser listHeader={headers} datas={displayedUsers} setAllUsers={setAllUsers} />
            </div>

            <div>
                <Pagination
                    count={searchUsers ? lastFilteredPageIndex : lastPageIndex}
                    page={currentPage}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
}
