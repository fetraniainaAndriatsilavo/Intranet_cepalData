import { Pagination, Snackbar, TextField } from "@mui/material";
import TableFeuille from "../../components/Mes Feuilles/TableFeuille";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx"; // ✅ Import SheetJS
import api from "../../components/axios";
import { PulseLoader } from "react-spinners";

export default function AllTimesheet() {
    const header = [
        "Nom",
        "Dossier",
        "Période",
        "Présence (h)",
        "Absence",
        "Congés",
        "Fériés",
        "Récupération",
        "Repos Médical",
    ];

    const [lists, setLists] = useState([]);
    const [searchUsers, setSearchUsers] = useState("");
    const [loading, setLoading] = useState(false)
    // Snackbar states
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const userPerPage = 10;

    // Fetch sessions + timesheet data
    useEffect(() => {
        setLoading(true)
        api
            .get("/timesheet-periods/active")
            .then((response) => {
                setLoading(false)
                setLists(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    // Filter by search term
    const fullyFiltered = lists.filter((user) => {
        const name = user.first_name?.toLowerCase() || "";
        const dossier = user.dossier?.toLowerCase() || "";
        const searchTerm = searchUsers.toLowerCase();
        return name.includes(searchTerm) || dossier.includes(searchTerm);
    });

    // Pagination for filtered results
    const lastFilteredPageIndex = Math.ceil(
        fullyFiltered.length / userPerPage
    );
    const filteredView = fullyFiltered.slice(
        (currentPage - 1) * userPerPage,
        currentPage * userPerPage
    );

    // Excel export  
    function exportToExcel(data) {
        if (data && data.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(data)
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

            XLSX.writeFile(workbook, "TousLesFeuillesDeTemps.xlsx");
            setSuccess("Fichier exporté avec succès ");
            setTimeout(() => setSuccess(""), 5000);
        } else {
            setError("Aucun fichier à exporter ");
            setTimeout(() => setError(""), 5000);
        }
    }

    return (
        <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
            <div className="mb-4 sm:mb-0 flex items-center justify-between w-full">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                    Résumé du Feuille de Temps mensuel
                </h1>
                <div className="gap-2 flex ">
                    <TextField
                        size="small"
                        label="Filtrer par nom ou dossier"
                        className="bg-white border-none border rounded-lg"
                        value={searchUsers}
                        onChange={(e) => {
                            setSearchUsers(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>
            {

                loading == true
                    ? <div className="flex items-center justify-center w-full h-full">
                        <PulseLoader
                            color={'#1a497f'}
                            loading={loading}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        ></PulseLoader>
                    </div> : <>
                        <div className="bg-white w-full rounded-lg">
                            <TableFeuille header={header} datas={filteredView} type="admin" />
                        </div>

                        <div className="flex items-center justify-end w-full">
                            <button
                                className="underline text-green-500 rounded-lg cursor-pointer flex gap-1 items-center flex-row justify-center"
                                onClick={(e) => {
                                    e.preventDefault();
                                    exportToExcel(fullyFiltered);
                                }}
                            >
                                {/* XLS Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="icon icon-tabler icon-tabler-file-type-xls"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                    <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
                                    <path d="M4 15l4 6" />
                                    <path d="M4 21l4 -6" />
                                    <path d="M17 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75" />
                                    <path d="M11 15v6h3" />
                                </svg>
                                Exporter en xlsx
                            </button>
                        </div>

                        {error && (
                            <Snackbar open={true} autoHideDuration={5000} message={error} />
                        )}
                        {success && (
                            <Snackbar open={true} autoHideDuration={5000} message={success} />
                        )}

                        <div>
                            <Pagination
                                count={lastFilteredPageIndex}
                                page={currentPage}
                                onChange={(e, value) => setCurrentPage(value)}
                            />
                        </div>
                    </>
            }
        </div>
    );
}
