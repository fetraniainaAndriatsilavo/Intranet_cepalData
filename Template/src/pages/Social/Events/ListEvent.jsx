import { Pagination } from "@mui/material";
import TableEvents from "../../../components/Events/TableEvents";
import { useEffect, useState } from "react";
import api from "../../../components/axios";
import CreateEvent from "./CreateEvent";
import EditEvent from "./EditEvent";

export default function ListEvent() {
    const [open, setOpen] = useState(false)
    const [openModif, setOpenModif] = useState(false)
    const headers = [
        'Titre',
        'Description',
        'Date',
        'Action Disponible'
    ]
    const [eventList, setEventList] = useState([])
    const [selecteEvent, setSelectedEvent] = useState(0)

    const fecthEvent = () => {
        api.get('/event/get')
            .then((response) => {
                setEventList(response.data.evenements)
            })
            .catch((error) => {
                console.log(error)
            })
    }


    useEffect(() => {
        fecthEvent()
    }, [])

    // pagination du tableau
    const [currentPage, setCurrentPage] = useState(1);
    const userPerPage = 10;
    const lastPageIndex = Math.ceil(eventList.length / userPerPage);
    const [currentView, setCurrentView] = useState([]);

    const handleChange = (event, value) => {
        setCurrentPage(value);
        setCurrentView(eventList.slice((value * userPerPage) - 10, value * userPerPage));
    };

    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0 flex items-center justify-between w-full">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                Events
            </h1>
            <button className="px-3 bg-sky-600 py-2 text-white cursor-pointer rounded-lg"
                onClick={() => {
                    setOpen(true)
                }}> + Ajouter </button>
        </div>
        <div className="bg-white w-full rounded-lg">
            <h3 className="p-3">
                Tous les Evènements
                <span className="text-gray-400 font-semibold">
                    {eventList ? '  ' + eventList.length : 0}
                </span>
            </h3>
            <TableEvents listHeader={headers}
                datas={eventList}
                fecthEvent={fecthEvent}
                setSelectedEvent={setSelectedEvent} 
                setOpenModif={setOpenModif}
            />
        </div>
        <div>
            <Pagination
                count={lastPageIndex}
                page={currentPage}
                onChange={handleChange}
            />
        </div>
        <CreateEvent fecthEvent={fecthEvent} open={open} onClose={() => {
            setOpen(false)
        }} />

        {
            selecteEvent != 0 && <EditEvent fecthEvent={fecthEvent} open={openModif} onClose={() => {
                setOpenModif(false)
            }} eventId={selecteEvent} />
        }
    </div>
}