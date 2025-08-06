import { useState } from "react";
import TableFeuille from "../../components/Mes Feuilles/TableFeuille"

export default function TeamTimesheet() {
    const header = [
        "Identifiant",
        "Cumul horaires", 
        "Session",
        "Action"
    ]
    const lists = []

    // pagination du tableau
    const [currentPage, setCurrentPage] = useState(1);
    const userPerPage = 10;
    const lastPageIndex = Math.ceil(lists.length / userPerPage);
    const [currentView, setCurrentView] = useState([]);

    const handleChange = (event, value) => {
        setCurrentPage(value);
        setCurrentView(lists.slice((value * userPerPage) - 10, value * userPerPage));
    };

    // date 
    let d = new Date()

    function isMiddleOfMonth(d) {
        const date = new Date(d);
        return date.getDate() > 17 && date.getDate() < 22;
    }

    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0 flex items-center justify-between w-full">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                Feuilles de Temps Equipes
            </h1>
            <button className="px-3 bg-sky-600 py-2 text-white cursor-pointer rounded"
                onClick={(e) => {
                    e.preventDefault()
                    window.location.href = '/creer-feuille'
                }}> Envoyer </button>
        </div>
        <div className="bg-white w-full rounded-lg">
            <div className="bg-white w-full rounded-lg">
                <h3 className="p-3"> Les personnes ayant soumises leurs feuilles de Temps 
                    <span className="text-gray-400 font-semibold"> {lists.length} </span> </h3>
                <TableFeuille header={header} datas={currentView.length < 1 ? lists.slice(0, userPerPage) : currentView} type={'equipe'}/>
            </div>
        </div> 
        {
            isMiddleOfMonth(d) == true && <div>
                <button className="px-3 bg-sky-600 py-2 text-white cursor-pointer rounded"> Envoyer </button>
            </div>
        }
    </div>
}