import { useState } from "react";
import api from "../axios"

export default function RowFeuille({ data, onEdit }) {
    const formatDate = (d) => {
        const date = new Date(d);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const [loading, setLoading] = useState(false)

    const deleteTimesheet = (id) => {
        setLoading(true)
        api.delete('/timesheet/' + id + '/destroy')
            .then(() => {
                setLoading(false)
                window.location.reload()
            })
            .catch((error) => {
                console.log(error.response.data.message)
            });
    }

    return <tr
        className={`bg-white hover:bg-gray-50 odd:bg-white`}>
        <td className="px-6 py-4 text-center"> {formatDate(data.created_at)} </td>
        <td className="px-6 py-4 whitespace-nowrap font-semibold"> {data.type || ''} </td>
        <td className="px-6 py-4 text-center"> {data.client?.name || ''} </td>
        <td className="px-6 py-4 text-center"> {data.project?.name || ' '} </td>
        <td className="px-6 py-4 text-center"> {data.description} </td>
        <td className="px-6 py-4 text-center">{data.nb_hour} </td>
        <td className="px-6 py-4 flex items-center justify-center gap-2">
            <button className="text-green-600 hover:underline cursor-pointer" onClick={() => onEdit(data.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-gray-500 icon icon-tabler icons-tabler-outline icon-tabler-edit">
                    <title> Modifier </title>
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                    <path d="M16 5l3 3" />
                </svg>
            </button>
            <button className="text-green-600 hover:underline cursor-pointer" onClick={() => {
                deleteTimesheet(data.id)
            }}>
                {
                    loading == true ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" classNames="text-red-500 icon icon-tabler icons-tabler-outline icon-tabler-loader">
                        <title> suppression en cours </title>
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 6l0 -3" />
                        <path d="M16.25 7.75l2.15 -2.15" />
                        <path d="M18 12l3 0" />
                        <path d="M16.25 16.25l2.15 2.15" />
                        <path d="M12 18l0 3" />
                        <path d="M7.75 16.25l-2.15 2.15" />
                        <path d="M6 12l-3 0" />
                        <path d="M7.75 7.75l-2.15 -2.15" />
                    </svg> :
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-red-500 icon icon-tabler icons-tabler-outline icon-tabler-trash">
                            <title> Supprimer </title>
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M4 7l16 0" />
                            <path d="M10 11l0 6" />
                            <path d="M14 11l0 6" />
                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                        </svg>
                }

            </button>
        </td>
    </tr>
}