import { useContext } from "react"
import api from "../axios"
import { AppContext } from "../../context/AppContext"

export default function TeamRowFeuille({ data, setDetails, setOpen, setMessage }) {
    const { user } = useContext(AppContext)

    const fetchTeamTimesheet = (id) => {
        api.get('/managers/' + id + '/timesheets/sent')
            .then((response) => {
                setLists(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const validateTimesheet = () => {
        api.post('/timesheets/approve', {
            user_id: data.user_id,
            approved_by: user.id,
            ts_period_id: data.timesheet_period.id,
        })
            .then((response) => {
                setMessage(response.data.message)
                fetchTeamTimesheet(user.id)
            })
            .catch((error) => {
                console.log(error.response.data.message)
            })
    } 

    return <tr
        className={`bg-white hover:bg-gray-50 odd:bg-white`}
    >
        <td className="px-6 py-4 font-medium whitespace-nowrap font-semibold"> {data.first_name} </td>
        <td className="px-6 py-4 text-center">{data.timesheet_period.periode} </td>
        <td className="px-6 py-4 flex items-center justify-center gap-2">
            <button className="cursor-pointer" onClick={() => {
                setDetails(data.details)
                setOpen(true)
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-sky-600 icon icon-tabler icons-tabler-outline icon-tabler-eye">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                    <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                </svg>
            </button>
            <button className="text-green-600 hover:underline cursor-pointer" onClick={() => {
                validateTimesheet()
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-green-500 icon icon-tabler icons-tabler-filled icon-tabler-circle-check">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
                </svg>
            </button>
            {/* <button className="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className=" text-yellow-300 icon icon-tabler icons-tabler-outline icon-tabler-alert-hexagon"><path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" />
                    <path d="M12 8v4" /><path d="M12 16h.01" />
                </svg>
            </button> */}
        </td>
    </tr>
}