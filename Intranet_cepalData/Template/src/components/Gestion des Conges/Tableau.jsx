import TableHeader from "../Conges/TableHeader"
import TabSoldes from "./TabSoldes"

export default function Tableau({ header, datas }) {
    return <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-center rtl:text-right text-gray-500 ">
            <thead className="text-xs  uppercase bg-gray-50">
                <tr>
                    {header.map((list) => <TableHeader colsName={list}></TableHeader>)}
                </tr>
            </thead>
            <tbody>
                {
                    datas && datas.map((data, index) => {
                        return <TabSoldes data={data} key={index} />
                    })
                }
            </tbody>
        </table>
    </div>
}