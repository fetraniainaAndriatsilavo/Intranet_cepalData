import TableHeader from "../Conges/TableHeader";
import AdminFeuille from "./AdminFeuille";
import RowFeuille from "./RowFeuille";
import TeamRowFeuille from "./TeamRowFeuille";

export default function TableFeuille({ header, datas, type }) {
    return <div className="relative overflow-x-auto rounded-lg">
        <table className="w-full text-sm text-center rtl:text-right text-gray-500 ">
            <thead className="text-xs  uppercase bg-gray-50">
                <tr>
                    {header.map((list) => <TableHeader colsName={list}></TableHeader>)}
                </tr>
            </thead>
            <tbody>
                {
                    type && type == 'personnel' && datas && datas.map((data, index) => {
                        return <RowFeuille data={data} key={index} />
                    })
                }
                {
                    type && type == 'equipe' && datas && datas.map((data, index) => {
                        return <TeamRowFeuille data={data} key={index} />
                    })
                }
                {
                    type && type == 'admin' && datas && datas.map((data, index) => {
                        return <AdminFeuille data={data} key={index} />
                    })
                }
            </tbody>
        </table>
    </div>
}