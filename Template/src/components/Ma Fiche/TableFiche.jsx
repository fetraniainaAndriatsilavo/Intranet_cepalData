import TableHeader from "../Conges/TableHeader";
import FicheRow from "./FicheRow";


export default function TableFiche({ listHeader, datas}) {

    return <div className="relative overflow-x-auto overflow-y-hidden rounded">
        <table className="w-full text-sm text-center rtl:text-right text-gray-500 ">
            <thead className="text-xs  uppercase bg-gray-50">
                <tr>
                    {listHeader.map((list) => <TableHeader colsName={list}></TableHeader>)}
                </tr>
            </thead>
            <tbody>
                {
                    datas && datas.map((data, index) => <FicheRow data={data} key={index} />)
                }
            </tbody>
        </table>
    </div>
}