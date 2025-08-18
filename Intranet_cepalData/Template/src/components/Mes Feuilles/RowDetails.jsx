export default function RowDetail({ data }) {
    const formatDate = (date) => {
        const weekDays = [
            'Dimanche', 
            'Lundi',
            'Mardi',
            'Mercredi',
            'Jeudi',
            'Vendredi',
            'Samedi',
        ]

        const month = [
            'Janvier',
            'Février',
            'Mars',
            'Avril',
            'Mai',
            'Juin',
            'Juillet',
            'Aout',
            'Septembre',
            'Octobre',
            'Novembre',
            'Décembre'
        ]

        const d = new Date(date)

        return weekDays[d.getDay()] + ' ' + d.getDate() + " " + month[d.getMonth()] + " " + d.getFullYear()
    }
    return <tr
        className={`bg-white hover:bg-gray-50 odd:bg-white`}
    >
        <td className="px-6 py-4 text-center"> {formatDate(data.date)} </td>
        <td className="px-6 py-4 text-center"> {data.nb_hour} </td>
        <td className="px-6 py-4 text-center"> {data.description} </td>
    </tr>
}