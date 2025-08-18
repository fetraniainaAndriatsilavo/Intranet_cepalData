export default function AdminFeuille({ data }) {  
    return <tr
        className={`bg-white hover:bg-gray-50 odd:bg-white`}
    >
        <td className="px-6 py-4 font-medium whitespace-nowrap font-semibold">{data.first_name}</td>
        <td className="px-6 py-4 text-center">  {data.department}</td>
        <td className="px-6 py-4 text-center"> {data.session} </td>
        <td className="px-6 py-4 text-center"> {Math.trunc(data.tâche)} </td>
        <td className="px-6 py-4 text-center"> {Math.trunc(data.absence)} </td>
        <td className="px-6 py-4 text-center"> {Math.trunc(data.congé)} </td>
        <td className="px-6 py-4 text-center"> {Math.trunc(data.jour_férié)} </td>
        <td className="px-6 py-4 text-center"> {Math.trunc(data.convalescence)} </td>
        <td className="px-6 py-4 text-center"> {Math.trunc(data.repos_médical)} </td>
    </tr>
}