export default function RowSessions({data}) {
    return <tr
        className={`bg-white hover:bg-gray-50 odd:bg-white`}
    >
        <td className="px-6 py-4 font-medium whitespace-nowrap font-semibold"> {data.periode} </td>
        <td className="px-6 py-4 text-center"> {data.start_date} </td>
        <td className="px-6 py-4 text-center"> {data.end_date} </td>   
        <td className="px-6 py-4 text-center">  {data.updated_at} </td> 
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
}