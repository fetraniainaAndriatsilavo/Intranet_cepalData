export default function TabSoldes({ data }) {
    return <tr
        className={`bg-white hover:bg-gray-50  odd:bg-white `}
    >
        <td className="px-6 py-4 font-medium whitespace-nowrap font-semibold">
            {data.username || '—'}
        </td>
        <td className="px-6 py-4 text-center">
            20
        </td>
        <td className="px-6 py-4 text-center">
            17
        </td>
        <td className="px-6 py-4 text-center">
            11
        </td>
    </tr>
}