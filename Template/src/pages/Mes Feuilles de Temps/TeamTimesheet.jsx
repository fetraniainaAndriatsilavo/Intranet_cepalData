import { useContext, useEffect, useState } from "react";
import TableFeuille from "../../components/Mes Feuilles/TableFeuille"
import api from "../../components/axios";
import { AppContext } from "../../context/AppContext";
import ViewTimeSheet from "./ViewTimesheet";
import { Snackbar } from "@mui/material";

export default function TeamTimesheet() {
    const { user } = useContext(AppContext)
    const header = [
        "Identifiant",
        "Session",
        "Action"
    ]
    const [details, setDetails] = useState([])
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState(null)
    const [lists, setLists] = useState([])


    const fetchTeamTimesheet = (id) => {
        api.get('managers/' + id + '/timesheets/sent')
            .then((response) => {
                setLists(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        fetchTeamTimesheet(user.id)
    }, [user])


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
        return date.getDate() > 17 && date.getDate() < 22;
    }

    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0 flex items-center justify-between w-full">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                Feuilles de Temps Equipes
            </h1>
        </div>
        <div className="bg-white w-full rounded-lg">
            <div className="bg-white w-full rounded-lg">
                <h3 className="p-3"> Les feuilles de temps reçues
                    <span className="text-gray-400 font-semibold"> {lists.length} </span> </h3>
                <TableFeuille
                    header={header}
                    datas={currentView.length < 1 ? lists.slice(0, userPerPage) : currentView}
                    type={'equipe'}
                    setDetails={setDetails}
                    setOpen={setOpen}
                    setMessage={setMessage}
                />
            </div>
        </div>
        {
            isMiddleOfMonth(d) == true && <div>
                <button className="px-3 bg-sky-600 py-2 text-white cursor-pointer rounded"> Envoyer </button>
            </div>
        }
        <ViewTimeSheet
            details={details ? details : []}
            open={open} handleClose={() => { setOpen(false) }} />

        {
            message && <Snackbar
                open={open}
                autoHideDuration={5000}
                message={message}
            />
        }
    </div>
}