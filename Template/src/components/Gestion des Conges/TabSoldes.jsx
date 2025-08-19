export default function TabSoldes({ data }) {
    return <tr
        className={`bg-white hover:bg-gray-50  odd:bg-white `}
    >
        <td className="px-6 py-4 font-medium whitespace-nowrap font-semibold">
            {data.first_name || '—'}
        </td>
        <td className="px-6 py-4 text-center">
            {data.ogc_leav_bal}
        </td>
        <td className="px-6 py-4 text-center">
             {data.ogc_perm_bal}
        </td>
        <td className="px-6 py-4 text-center">
             {data.ogc_othr_bal}
        </td>
    </tr>
}