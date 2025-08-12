export default function AdminFeuille({ data }) {
    return <tr
        className={`bg-white hover:bg-gray-50 odd:bg-white`}
    >
        <td className="px-6 py-4 font-medium whitespace-nowrap font-semibold">{data.first_name}</td>
        <td className="px-6 py-4 text-center">  {data.department}</td>
        <td className="px-6 py-4 text-center"> {data.session} </td>
        <td className="px-6 py-4 text-center"> {data.tâche} </td>
        <td className="px-6 py-4 text-center"> {data.absence} </td>
        <td className="px-6 py-4 text-center"> {data.congé} </td>
        <td className="px-6 py-4 text-center"> {data.jour_férié} </td>
        <td className="px-6 py-4 text-center"> {data.convalescence} </td>
        <td className="px-6 py-4 text-center"> {data.repos_médical} </td>
    </tr>
}