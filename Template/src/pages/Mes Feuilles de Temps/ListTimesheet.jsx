import { useContext, useEffect, useState } from "react";
import TableFeuille from "../../components/Mes Feuilles/TableFeuille"
import { Alert, Pagination, Snackbar } from "@mui/material";
import CreateTimeSheet from "./CreateTimesheet";
import ModifyTimeSheet from "./ModifyTimesheet";
import api from "../../components/axios";
import { AppContext } from "../../context/AppContext";

export default function ListTimeSheet() {
    const { user } = useContext(AppContext)
    const header = [
        "Nom",
        "Description",
        "Clients",
        "Durée (h)",
        "Action Disponible"
    ]

    const [lists, setLists] = useState([])
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [sessionsId, setSessions] = useState()

    useEffect(() => {
        api.get("/timesheet-periods/all")
            .then((response) => {
                const activeSessions = response.data.filter(
                    (session) => session.status === "active"
                );
                console.log(activeSessions)
                if (activeSessions.length > 0) {
                    setSessions(activeSessions[activeSessions.length - 1].id);
                }
            })
            .catch((error) => {
                console.error("Error fetching timesheet periods:", error);
            });
    }, []);

    const fetchTimeSheetUser = (id) => {
        api.get('/timesheet/' + id + '/user')
            .then((response) => {
                setLists(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        fetchTimeSheetUser(user.id)
    }, [user]);

    // pagination du tableau
    const [currentPage, setCurrentPage] = useState(1);
    const userPerPage = 10;
    const lastPageIndex = Math.ceil(lists.length / userPerPage);
    const [currentView, setCurrentView] = useState([]);

    const handleChange = (event, value) => {
        setCurrentPage(value);
        setCurrentView(lists.slice((value * userPerPage) - 10, value * userPerPage));
    };

    // date 
    let d = new Date()

    function isMiddleOfMonth(d) {
        const date = new Date(d);
        return date.getDate() > 10 && date.getDate() < 22;
    }

    // ouverture modeal 
    const [open, setOpen] = useState(false);

    // ouverture du modale de modification 
    const [openModal, setOpenModal] = useState(false)
    const [FeuilleId, setFeuilleId] = useState(null)

    const handleEditClick = (FeuilleId) => {
        setFeuilleId(FeuilleId)
        setOpenModal(true);
    };

    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0 flex items-center justify-between w-full">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                Vos Feuilles de Temps
            </h1>
            <button className="px-3 bg-sky-600 py-2 text-white cursor-pointer rounded-lg"
                onClick={() => {
                    setOpen(true)
                }}> + Ajouter </button>
        </div>
        <div className="bg-white w-full rounded-lg">
            <h3 className="p-3"> Liste des feuilles de temps durant la session
                <span className="text-gray-400 font-semibold"> {lists.length} </span> </h3>
            <TableFeuille header={header} datas={currentView.length < 1 ? lists.slice(0, userPerPage) : currentView} type={'personnel'} onEdit={handleEditClick} />
        </div>
        <div>
            <Pagination
                count={lastPageIndex}
                page={currentPage}
                onChange={handleChange}
            />
        </div>
        {
            isMiddleOfMonth(d) == true && <div>
                <button className="px-3 bg-sky-600 py-2 text-white cursor-pointer rounded" onClick={(e) => {
                    e.preventDefault()
                    api.post('/timesheets/' + user.id + '/send', {
                    })
                        .then((response) => {
                            console.log(response.data)
                            setSuccess(response.data.message)
                            fetchTimeSheetUser(user.id)
                        })
                        .catch((error) => {
                            console.log(error.response.data)
                            setError(error.response.data.message)
                        }) 
                }}> Terminer la sessions </button>
            </div>
        }

        {/* modal pour créer une feuille de tempss */}
        <CreateTimeSheet
            open={open}
            onClose={() => setOpen(false)} 
            fetchTimeSheetUser={fetchTimeSheetUser}
        />

        {/* modal pour modifier une feuille de tempss */}
        <ModifyTimeSheet open={openModal} onClose={() => setOpenModal(false)} id={FeuilleId ? FeuilleId : null} />

        {/* Toast pour notifications */}
        {
            success && <Snackbar autoHideDuration={6000}>
                <Alert
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {success}
                </Alert>
            </Snackbar>
        }

    </div>
}