import Table from "../../components/Conges/Table";

export default function ListeConges() {
    const listMenu = [
        "Identifiant de l'utilisateur",
        "Solde de congés",
        "Motif de la demande",
        "Date de début",
        "Date de fin",
        "Délai",
        "Date de soumission",
        "Statut de la demande"
    ];

    return <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-6xl mx-auto p-3">
        <h1 className="p-5 font-semibold lg:text-3xl w-full bg-gray-50 text-sky-500 mb-3"> Historiques des Congés </h1>
        <Table listHeader={listMenu} datas={[
            {
                user: {
                    name: 'Hery Niaina'
                },
                reason: 'Vacances',
                start_date: '07/28/2025',
                end_date: '08/31/2025',
                request_type: 'leave',
                created_at: '25/07/2025'
            },
            {
                user: {
                    name: 'Niaina'
                },
                reason: 'Vacances',
                start_date: '07/28/2025',
                end_date: '08/11/2025',
                request_type: 'leave',
                created_at: '25/07/2025'
            },
            {
                user: {
                    name: 'Hery '
                },
                reason: 'Vacances',
                start_date: '07/28/2025',
                end_date: '08/01/2025',
                request_type: 'leave',
                created_at: '25/07/2025'
            },
            {
                user: {
                    name: 'Hery '
                },
                reason: 'Vacances',
                start_date: '07/28/2025',
                end_date: '08/04/2025',
                request_type: 'leave',
                created_at: '25/07/2025'
            }
        ]} />
    </div>
}