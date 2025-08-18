import TableHeader from "../Conges/TableHeader";
import UserRows from "./UserRows";

export default function TableUser({ listHeader, datas, setAllUsers }) {
    return <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-center rtl:text-right text-gray-500 ">
            <thead className="text-xs  uppercase bg-gray-50">
                <tr>
                    {listHeader.map((list) => <TableHeader colsName={list}></TableHeader>)}
                </tr>
            </thead>
            <tbody>
                {
                    datas && datas.map((data) => <UserRows data={data} setAllUsers={setAllUsers}> </UserRows>)
                }
            </tbody>
        </table>
    </div>
}