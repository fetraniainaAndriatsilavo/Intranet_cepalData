import api from "../axios";

export default function EventRows({ data, fecthEvent, setSelectedEvent, setOpenModif }) {
    const formatDate = (d) => {
        const jours = [
            "Dimanche",
            "Lundi",
            "Mardi",
            "Mercredi",
            "Jeudi",
            "Vendredi",
            "Samedi"
        ]

        const mois = [
            "Janvier",
            "Février",
            "Mars",
            "Avril",
            "Mai",
            "Juin",
            "Juillet",
            "Aout",
            "Septembre",
            "Octobre",
            "Novembre",
            "Décembre"
        ]
        const date = new Date(d)
        return jours[date.getDay()] + " " + date.getDate() + " " + mois[date.getMonth()] + " " + date.getFullYear()
    }


    const deleteEvent = (EvenetId) => {
        api.delete('event/delete/' + EvenetId)
            .then(() => {
                fecthEvent()
            })
    }

    return <tr
        className={`bg-white hover:bg-gray-50  odd:bg-white `}
    >
        <td className="px-6 py-4 font-medium whitespace-nowrap font-semibold">
            {data.title}
        </td>
        <td className="px-6 py-4 text-center">
            {data.description}
        </td>
        <td className="px-6 py-4 text-center">
            {formatDate(data.date)}
        </td>
        <td className="px-6 py-4 text-center font-semibold gap-3 flex items-center justify-center">
            <button onClick={() => {
                setOpenModif(true)
                setSelectedEvent(data.id)
            }} className="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-gray-300 icon icon-tabler icons-tabler-outline icon-tabler-edit">
                    <title> Modifier </title>
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                    <path d="M16 5l3 3" />
                </svg>
            </button>
            <button onClick={(e) => {
                if (confirm(`Voulez-vous supprimer cette évènement?`)) {
                    e.preventDefault()
                    deleteEvent(data.id)
                }
            }} className="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className=" text-red-500 icon icon-tabler icons-tabler-outline icon-tabler-trash">
                    <title> Supprimer </title>
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 7l16 0" />
                    <path d="M10 11l0 6" />
                    <path d="M14 11l0 6" />
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
            </button> </td>
    </tr >
}