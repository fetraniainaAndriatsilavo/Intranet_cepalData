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
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        api.get('/getUser/all')
            .then((response) => {
                setAllUsers(response.data.users);
                setLoading(false)
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // pagination du tableau
    const [currentPage, setCurrentPage] = useState(1);
    const userPerPage = 5;
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
    const [active, setActive] = useState('active')

    const filteredUsers = allUsers.filter((user) => {
        const first_name = user.first_name?.toLowerCase() || "";
        const last_name = user.last_name?.toLowerCase() || "";
        const email = user.email?.toLowerCase() || "";
        const role = user.role?.toLowerCase() || "";
        const status = user.status?.toLowerCase() || "";

        const matchesSearch =
            first_name.includes(searchUsers.toLowerCase()) ||
            last_name.includes(searchUsers.toLowerCase()) ||
            email.includes(searchUsers.toLowerCase()) ||
            role.includes(searchUsers.toLowerCase());

        const matchesStatus = status == active;

        if (!searchUsers && status) {
            return matchesStatus;
        } else {
            return matchesSearch && matchesStatus;
        }
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
                <div className="flex flex-row gap-3">
                    <select className="rounded border-0" onChange={(e) => {
                        setActive(e.target.value)
                    }}>
                        <option value={'active'}> active </option>
                        <option value={'inactive'}> inactive </option>
                    </select>

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
            </div>
            {
                loading == true ? <div className="flex items-center justify-center w-full h-full">
                    <PulseLoader
                        color={'#1a497f'}
                        loading={loading}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    ></PulseLoader>
                </div> : <>
                    <div className="bg-white w-full rounded-lg">
                        <h3 className="p-3">
                            Total des Collaborateurs : {" "}
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
                </>
            }
        </div>
    );
}
