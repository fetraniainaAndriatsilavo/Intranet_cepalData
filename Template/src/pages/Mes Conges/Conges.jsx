import { useState } from "react";
import Type from "../../components/Conges/Type"
import Permissions from "../../components/Conges/Permissions"
export default function Conges() {
    const [radioValue, setRadioValue] = useState(null);
    const menus = [
        {
            name: "congés",
            label: "Congés payés ",
            valeur: "congés",
        },
        {
            name: "permissions",
            label: " Permissions avec justificatifs",
            valeur: "permission",
        },
        {
            name: "Autres",
            label: "congés sans soldes, mises à pieds, hospitalisation",
            valeur: "autres",
        },
    ] 

    
    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold"> Demande de Congés </h1>
        </div>
        <div className="bg-white  w-full rounded-lg">
            {/* <h3 className="p-3 "> Tous les Collaborateurs </h3> */}
            <Type lists={menus} setRadioValue={setRadioValue} />
            <Permissions radioValue={radioValue} />
        </div>
    </div>
}