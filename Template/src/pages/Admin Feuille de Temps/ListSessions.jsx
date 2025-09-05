import { useEffect, useState } from "react";
import TableFeuille from "../../components/Mes Feuilles/TableFeuille";
import Sessions from "./Sessions";
import api from "../../components/axios";
import EditSessions from "./EditSessions";
import { PulseLoader } from "react-spinners";

export default function ListSessions() {
    const header = [
        "Période",
        "Date de Début",
        "Date de Fin",
        "Créé le",
        "Action"
    ]
    const [open, setOpen] = useState(false)
    const [lists, setLists] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchSession = () => {
        setLoading(true)
        api.get('/timesheet-periods/all')
            .then((response) => {
                setLoading(false)
                setLists(response.data)
            })
            .catch((error) => {

            })
    }

    useEffect(() => {
        fetchSession()
    }, [])

    const [openModal, setOpenModal] = useState(false)
    const [sessionsId, setSessionsId] = useState(null);

    const handleEditClick = (sessionsId) => {
        setSessionsId(sessionsId)
        setOpenModal(true);
    };
    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0 flex items-center justify-between w-full">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                Listes des Sessions
            </h1>
            <button className="px-3 bg-sky-600 py-2 text-white cursor-pointer rounded-lg"
                onClick={() => {
                    setOpen(true)
                }}> + Créer une Session</button>
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
                        <h3 className="p-3">
                            Tous les sessions
                            <span className="text-gray-400 font-semibold">
                                {lists.length}
                            </span>
                        </h3>
                        <TableFeuille header={header} datas={lists} type={'sessions'} onEdit={handleEditClick} fetchSession={fetchSession} />
                    </div>
                </>
        }
        <Sessions open={open} onClose={() => setOpen(false)} />
        <EditSessions open={openModal} onClose={() => setOpenModal(false)} sessionsId={sessionsId} />
    </div>
}