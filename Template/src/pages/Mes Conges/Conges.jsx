import { useState } from "react";
import Type from "../../components/Conges/Type"
import Permissions from "../../components/Conges/Permissions"
export default function Conges() {
    const [radioValue, setRadioValue] = useState(null);
    const menus = [
        {
            name: "congés",
            label: "Congés payés ",
            valeur: "leave",
        },
        {
            name: "permissions",
            label: " Permissions avec justificatifs",
            valeur: "permission",
        },
        {
            name: "Autres",
            label: "congés sans soldes, mises à pieds, hospitalisation",
            valeur: "other",
        },
    ]
    return <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-6xl mx-auto p-3"> 
    <h1 className="p-5 font-semibold lg:text-3xl w-full bg-gray-50 text-sky-500"> Demande de Congés </h1>
        <Type lists={menus} setRadioValue={setRadioValue} />
        <Permissions radioValue={radioValue} />
    </div>
}