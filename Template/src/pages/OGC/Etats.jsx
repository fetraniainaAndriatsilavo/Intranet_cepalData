import Tableau from "../../components/Gestion des Conges/Tableau";

export default function Etats() {
    const header = [
        "Nom complet",
        "Congés annuels",
        "Permissions exceptionnelles",
        "Autres absences"
    ];


    const list = [
        {
            username: 'user1'
        },
        {
            username: 'user2'
        },
        {
            username: 'user3'
        },
    ]
    return <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-6xl mx-auto p-3">
        <h1 className="p-5 font-semibold lg:text-3xl w-full bg-gray-50 text-sky-500 mb-3"> Soldes des personnelles  </h1>
        <Tableau header={header} datas={list} />
    </div>
}