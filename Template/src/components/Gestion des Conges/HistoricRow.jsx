import api from "../axios";

export default function HistoricRow({ data }) {
    const formatDate = (d) => {
        const date = new Date(d);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const excludedPermission = [
        'Congé payé',
        'Congé sans solde',
        "Hospitalisation d'un enfant",
        "Hospitalisation de conjoint",
        "Mises à pieds"
    ];

    const AutreTypes = [
        "Hospitalisation d'un enfant",
        "Hospitalisation de conjoint",
        "Mises à pieds"
    ]

    const CongeType = [
        'Congé payé',
        'Congé sans solde'
    ]

    return (
        <tr
            className={`bg-white hover:bg-gray-50 odd:bg-white ${data.status === 'refused' ? 'text-red-500' : 'text-gray-500'
                }`}
        >
            {/* Nom d'utilisateur */}
            <td className="px-6 py-4 font-medium whitespace-nowrap font-semibold">
                {data.user?.last_name + " " + data.user?.first_name}
            </td>

            {/* Soldes */}
            <td className="px-6 py-4 text-center">
                {
                    CongeType.includes(data.leave_type?.name)
                        ? data.user?.ogc_leav_bal ?? 0
                        : !excludedPermission.includes(data.leave_type?.name)
                            ? data.user?.ogc_perm_bal ?? 0
                            : data.user?.ogc_othr_bal ?? 0
                }

            </td>

            {/* Motif */}
            <td className="px-6 py-4">
                {data.leave_type?.name || 'Vacances'}
            </td>

            {/* Date de début */}
            <td className="px-6 py-4">
                {formatDate(data.start_date)}
            </td>

            {/* Date de fin */}
            <td className="px-6 py-4">{formatDate(data.end_date)}</td>

            {/* Durée */}
            <td className="px-6 py-4 text-center">
                {
                    Number(data.number_day)
                }
            </td>


            {/* Créé le */}
            <td className="px-6 py-4">{formatDate(data.created_at)}</td>

            {/* Action */}
            <td className="px-6 py-4 flex items-center justify-center gap-2">
                {
                    data.status && data.status == 'approved' ? <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="icon icon-tabler icons-tabler-filled icon-tabler-circle-check text-green-500"

                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <title> approuvé </title>
                        <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
                    </svg> : data.status == 'created' ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-loader"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 6l0 -3" /><path d="M16.25 7.75l2.15 -2.15" /><path d="M18 12l3 0" /><path d="M16.25 16.25l2.15 2.15" />
                        <title> en attente de validation </title>
                        <path d="M12 18l0 3" />
                        <path d="M7.75 16.25l-2.15 2.15" />
                        <path d="M6 12l-3 0" />
                        <path d="M7.75 7.75l-2.15 -2.15" />
                    </svg> : data.status == 'canceled' ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-u-turn-left">
                            <title> demandes annulée </title>
                            <g transform="rotate(90 12 12)">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M17 20v-11.5a4.5 4.5 0 1 0 -9 0v8.5" />
                                <path d="M11 14l-3 3l-3 -3" />
                            </g>
                        </svg> :
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
                            className="icon icon-tabler icons-tabler-outline icon-tabler-circle-dashed-x text-red-500"
                        >
                            <title> refusé </title>
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
                }
            </td>
        </tr>
    );
}

