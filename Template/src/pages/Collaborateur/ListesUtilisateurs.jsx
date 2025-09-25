import { Pagination, TextField } from "@mui/material";
import TableUser from "../../components/Collaborateurs/TableUser";
import { useEffect, useState } from "react";
import api from "../../components/axios";
import { PulseLoader } from "react-spinners";

export default function ListesUtilisateurs() {
    const headers = [
        'Profil',
        'Email',
        'Poste',
        'Département',
        'Date d\'embauche',
        'Action'
    ];

    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        api.get('/getUser/all')
            .then((response) => {
                setAllUsers(response.data.users);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false)
            })

    }, []);

    // filtre
    const [searchUsers, setSearchUsers] = useState("");
    const [active, setActive] = useState("tous");

    // 1. filter by status
    const statusFiltered = active === "tous"
        ? allUsers
        : allUsers.filter(user => user.status === active);

    // 2. filter by search
    const filteredUsers = statusFiltered.filter((user) => {
        const first_name = user.first_name?.toLowerCase() || "";
        const last_name = user.last_name?.toLowerCase() || "";
        const email = user.email?.toLowerCase() || "";
        const role = user.role?.toLowerCase() || "";

        const search = searchUsers.toLowerCase();
        return (
            first_name.includes(search) ||
            last_name.includes(search) ||
            email.includes(search) ||
            role.includes(search)
        );
    });

    // pagination (always applied to filtered users)
    const [currentPage, setCurrentPage] = useState(1);
    const userPerPage = 10;
    const lastPageIndex = Math.ceil(filteredUsers.length / userPerPage);

    const displayedUsers = filteredUsers.slice(
        (currentPage - 1) * userPerPage,
        currentPage * userPerPage
    );

    // reset to page 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [active, searchUsers]);

    return (
        <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
            <div className="mb-4 sm:mb-0 flex items-center justify-between w-full">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                    Les Collaborateurs
                </h1>
                <div className="flex flex-row gap-3">
                    <select
                        className="rounded border-0"
                        value={active}
                        onChange={(e) => setActive(e.target.value)}
                    >
                        <option value="tous">Tous</option>
                        <option value="active">Actifs</option>
                        <option value="inactive">Inactifs</option>
                    </select>

                    <TextField
                        size="small"
                        label="Rechercher par nom, role"
                        className="bg-white border-transparent rounded-lg"
                        value={searchUsers}
                        onChange={(e) => setSearchUsers(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center w-full h-full">
                    <PulseLoader
                        color={"#1a497f"}
                        loading={loading}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            ) : (
                <>
                    <div className="bg-white w-full rounded-lg">
                        <h3 className="p-3">
                            <span className="text-gray-400 font-semibold">
                                {filteredUsers.length}
                            </span> 
                            &nbsp;collaborateurs
                        </h3>
                        <TableUser
                            listHeader={headers}
                            datas={displayedUsers}
                            setAllUsers={setAllUsers}
                        /> 
                    </div>
                    <div>
                        <Pagination
                            count={lastPageIndex}
                            page={currentPage}
                            onChange={(event, value) => setCurrentPage(value)}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
