import { Pagination, TextField } from "@mui/material";
import Table from "../../components/Conges/Table";
import { useEffect, useState } from "react";
import api from "../../components/axios";
import { PulseLoader } from "react-spinners";

export default function ListeConges() {
    const listMenu = [
        "Identifiant",
        "Solde",
        "Motif de la demande",
        "Date de début",
        "Date de fin",
        "Délai",
        "Date de soumission",
        "Statut de la demande"
    ];

    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        api.get("/all-requests")
            .then((response) => {
                setLoading(false);
                setList(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false)
            });
    }, []);

    const AutreTypes = [
        "Hospitalisation d'un enfant",
        "Hospitalisation de conjoint",
        "Mises à pieds"
    ]

    const excludedPermission = [
        'Congé payé',
        'Congé sans solde',
        "Hospitalisation d'un enfant",
        "Hospitalisation de conjoint",
        "Mises à pieds"
    ];

    // filters
    const [searchUsers, setSearchUsers] = useState("");
    const [type, setType] = useState("tous");

    // 1. filter by type
    const typeFiltered =list.filter((demande) => {
        const leaveType = demande.leave_type;
        if (type === "tous") {
            return true;
        }
        return (
            (type === "congés" && (leaveType.name === "Congé payé" || leaveType.name === "Congé sans solde")) ||
            (type === "permission" && !excludedPermission.includes(leaveType.name)) ||
            (type === "autres" && AutreTypes.includes(leaveType.name))
        );
    });

    // 2. filter by search (on top of type)
    const filteredUsers = typeFiltered.filter((demande) => {
        const first_name = demande.user.first_name?.toLowerCase() || "";
        const last_name = demande.user.last_name?.toLowerCase() || "";
        const role = demande.user.role?.toLowerCase() || "";

        const search = searchUsers.toLowerCase();
        return (
            first_name.includes(search) ||
            last_name.includes(search) ||
            role.includes(search)
        );
    });

    // pagination (always on filtered list)
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
    }, [type, searchUsers]);

    return (
        <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
            <div className="mb-4 sm:mb-0 flex items-center justify-between w-full">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                    Historique des demandes
                </h1>
                <div className="flex flex-row gap-3">
                    <select
                        className="rounded border-0"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="tous"> Tout </option>
                        <option value="congés"> Congé </option>
                        <option value="permission"> Permission </option>
                        <option value="autres"> Autre </option>
                    </select>

                    <TextField
                        size="small"
                        label="Rechercher par nom"
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
                            <span className="font-semibold text-gray-300">
                                {filteredUsers.length}
                            </span>
                            &nbsp;demandes
                        </h3>
                        <Table
                            listHeader={listMenu}
                            datas={displayedUsers}
                            type="historic"
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
