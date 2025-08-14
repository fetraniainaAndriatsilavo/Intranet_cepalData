import TableHeader from "../Conges/TableHeader";
import AdminFeuille from "./AdminFeuille";
import RowDetail from "./RowDetails";
import RowFeuille from "./RowFeuille";
import RowSessions from "./RowSessions";
import TeamRowFeuille from "./TeamRowFeuille";

export default function TableFeuille({ header, datas, type, onEdit, fetchSession, setDetails, setOpen, setMessage }) {
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
                        return <RowFeuille data={data} key={index} onEdit={onEdit} />
                    })
                }
                {
                    type && type == 'equipe' && datas && datas.map((data, index) => {
                        return <TeamRowFeuille data={data} key={index} setDetails={setDetails}  setOpen={setOpen} setMessage={setMessage}  />
                    })
                }
                {
                    type && type == 'admin' && datas && datas.map((data, index) => {
                        return <AdminFeuille data={data} key={index} />
                    })
                }
                {
                    type && type == 'sessions' && datas && datas.map((data, index) => {
                        return <RowSessions data={data} key={index} onEdit={onEdit} fetchSession={fetchSession} />
                    })
                }
                {
                    type && type == 'view' && datas && datas.map((data, index) => {
                        return <RowDetail data={data} key={index} />
                    })
                }
            </tbody>
        </table>
    </div>
}