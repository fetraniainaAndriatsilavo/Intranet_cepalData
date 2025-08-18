import { useContext, useEffect, useState } from "react";
import EventCard from "./EventCard";
import api from "../../../components/axios";
import { AppContext } from "../../../context/AppContext";
export default function Events({ setOpen }) {

  const { user } = useContext(AppContext)
  const [eventList, setEventList] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    api.get('/event/get')
      .then((response) => {
        setEventList(response.data.evenements)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <div className="flex flex-col p-3 bg-white rounded-lg h-auto">
      <div className="title-group flex flex-row mb-3 mt-2 items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-calendar-event">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 5m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
          <path d="M16 3l0 4" />
          <path d="M8 3l0 4" />
          <path d="M4 11l16 0" />
          <path d="M8 15h2v2h-2z" />
        </svg>
        <h1 className="font-bold mx-5 text-xl"> Evènements</h1>
        {/* {
          (user.role === 'user') && <button onClick={() => {
            setIsOpen(!isOpen)
            setOpen(isOpen)
          }}> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-sky-600 icon icon-tabler icons-tabler-outline icon-tabler-plus hover:rounded-full hover:bg-sky-600 hover:text-white">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 5l0 14" />
              <path d="M5 12l14 0" />
            </svg> </button>
        } */}
      </div>
      <div className="p-2 w-full gap-4">
        {
          eventList.length > 0 && eventList.map((evenement, key) => <EventCard evenement={evenement} key={key}> </EventCard>)
        }
      </div>
    </div>
  );
}
