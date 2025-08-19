import { useEffect, useState } from "react";
import api from "../axios";

export default function Demande({ data, setMessage, setOpen, fetchDemandes }) {
  function getWorkingDays(startDateStr, endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    let count = 0;

    if (endDate < startDate) {
      return 0;
    }

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const day = currentDate.getDay();
      if (day !== 0 && day !== 6) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
  }

  function FormatDate(d) {
    let date = new Date(d)
    return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
  }

  const toggleArchive = (id, ChangedStatus) => {
    api.put(`/leave-requests/${id}/change`, { status: ChangedStatus })
      .then((response) => {
        setMessage(response.data.message)
        setOpen(true) 
        fetchDemandes();
      })
      .catch((error) => {
        console.error("Failed to update status:", error);
      });
  };

  return (
    <tr
      className={`bg-white hover:bg-gray-50 odd:bg-white ${data.status === 'refused' ? 'text-red-500' : 'text-gray-500'
        }`}
    >
      {/* Nom d'utilisateur */}
      <td className="px-6 py-4 font-medium whitespace-nowrap font-semibold">
        {data.user?.first_name + " " + data.user?.last_name}
      </td>

      {/* Soldes */}
      <td className="px-6 py-4 text-center">
        {data.user?.ogc_leav_bal}
      </td>

      {/* Motif */}
      <td className="px-6 py-4">
        {data.leave_type?.name}
      </td>

      {/* Date de début */}
      <td className="px-6 py-4">
        {FormatDate(data.start_date)}
      </td>

      {/* Date de fin */}
      <td className="px-6 py-4">{FormatDate(data.end_date)}</td>

      {/* Durée */}
      <td className="px-6 py-4 text-center">
        {
          getWorkingDays(data.start_date, data.end_date)
        }
      </td>


      {/* Créé le */}
      <td className="px-6 py-4">{FormatDate(data.created_at)}</td>

      {/* Action */}
      <td className="px-6 py-4 flex items-center justify-center gap-2">

        {/* Vrai */}
        <button className="text-green-600 hover:underline cursor-pointer" onClick={() => {
          toggleArchive(data.id, 'approved')
        }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="icon icon-tabler icons-tabler-filled icon-tabler-circle-check"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
          </svg>
        </button>

        {/* Faux*/}
        <button className="text-red-600 hover:underline cursor-pointer" onClick={() => {
          toggleArchive(data.id, 'refused')
        }}>
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
            className="icon icon-tabler icons-tabler-outline icon-tabler-circle-dashed-x"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M8.56 3.69a9 9 0 0 0 -2.92 1.95" />
            <path d="M3.69 8.56a9 9 0 0 0 -.69 3.44" />
            <path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" />
            <path d="M8.56 20.31a9 9 0 0 0 3.44 .69" />
            <path d="M15.44 20.31a9 9 0 0 0 2.92 -1.95" />
            <path d="M20.31 15.44a9 9 0 0 0 .69 -3.44" />
            <path d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92" />
            <path d="M15.44 3.69a9 9 0 0 0 -3.44 -.69" />
            <path d="M14 14l-4 -4" />
            <path d="M10 14l4 -4" />
          </svg>
        </button>
      </td>
    </tr>
  );
}

