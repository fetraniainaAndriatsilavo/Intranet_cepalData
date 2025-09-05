import { Pagination, TextField } from "@mui/material";
import Table from "../../components/Conges/Table";
import { useEffect, useState } from "react";
import api from "../../components/axios";
import { PulseLoader } from "react-spinners";

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
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        api.get('/all-requests')
            .then((response) => {
                setLoading(false)
                setList(response.data);
                // .filter((demande) => demande.status !== 'created')
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    // pagination du tableau
    const [currentPage, setCurrentPage] = useState(1);
    const userPerPage = 10;
    const lastPageIndex = Math.ceil(list.length / userPerPage);
    const [currentView, setCurrentView] = useState([]);

    const handleChange = (event, value) => {
        setCurrentPage(value);
        setCurrentView(list.slice((value * userPerPage) - 10, value * userPerPage));
    };

    useEffect(() => {
        const startIndex = (currentPage - 1) * userPerPage;
        const endIndex = currentPage * userPerPage;
        setCurrentView(list.slice(startIndex, endIndex));
    }, [list, currentPage]);

    // filtre par nom et role 
    const [searchUsers, setSearchUsers] = useState("");
    const [type, setType] = useState('congés')

    const filteredUsers = list.filter((demande) => {
        const first_name = demande.user.first_name?.toLowerCase() || "";
        const last_name = demande.user.last_name?.toLowerCase() || "";
        const role = demande.user.role?.toLowerCase() || "";
        const leaveType = demande.leave_type;;

        const matchesSearch =
            first_name.includes(searchUsers.toLowerCase()) ||
            last_name.includes(searchUsers.toLowerCase()) ||
            role.includes(searchUsers.toLowerCase());

        const matchesType =
            (type === 'congés' && leaveType.is_right === true) ||
            (type === 'permission' && leaveType.is_permission === true) ||
            (type === 'autres' && leaveType.is_other === true);


        if (searchUsers == '') {
            return matchesType
        } else {
            return matchesSearch && matchesType
        }
    });

    // pagination pour filtered users
    const lastFilteredPageIndex = Math.ceil(filteredUsers.length / userPerPage);
    const filteredView = filteredUsers.slice((currentPage - 1) * userPerPage, currentPage * userPerPage);

    // choisir laquelle  utilisateurs 
    const displayedUsers = searchUsers
        ? filteredView
        : currentView.length < 1
            ? list.slice(0, 10)
            : currentView;



    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0 flex items-center justify-between w-full">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold"> Historiques des demandes </h1>
            <div className="flex flex-row gap-3">
                <select className="rounded border-0" onChange={(e) => {
                    setType(e.target.value)
                }}>
                    <option value={'congés'}> Congés </option>
                    <option value={'permission'}> Permission </option>
                    <option value={'autres'}> Autres </option>
                </select>
                <TextField
                    size="small"
                    label='Rechercher par nom'
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
                <div className="bg-white  w-full rounded-lg">
                    <h3 className="p-3 "> Total des demandes : <span className=" font-semibold text-gray-300"> {searchUsers ? filteredUsers.length : list ? list.length : 0} </span> </h3>
                    <Table listHeader={listMenu} datas={displayedUsers} type='historic' />
                </div>
                <div>
                    <Pagination count={searchUsers ? lastFilteredPageIndex : lastPageIndex} page={currentPage} onChange={handleChange} />
                </div>
            </>
        }
    </div>
}