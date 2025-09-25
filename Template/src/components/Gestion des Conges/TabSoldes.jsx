export default function TabSoldes({ data }) {
    return <tr
        className={`bg-white hover:bg-gray-50  odd:bg-white `}
    >
        <td className="px-6 py-4 font-medium whitespace-nowrap font-semibold flex gap-1 justify-center">
            <span>
                {data.last_name || '—'}
            </span>
            <span>
                {data.first_name || '—'}
            </span>
        </td>
        <td className="px-6 py-4 text-center">
            {data.ogc_leav_bal || 0 }
        </td>
        <td className="px-6 py-4 text-center">
            {data.ogc_perm_bal || 0 }
        </td>
        <td className="px-6 py-4 text-center">
            {data.ogc_othr_bal || 0 }
        </td>
    </tr>
}