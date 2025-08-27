import TableHeader from "../Conges/TableHeader";
import EventRows from "./EventRows";

export default function TableEvents({ listHeader, datas, fecthEvent, setSelectedEvent, setOpenModif }) {
    return <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-center rtl:text-right text-gray-500 ">
            <thead className="text-xs  uppercase bg-gray-50">
                <tr>
                    {listHeader.map((list) => <TableHeader colsName={list}></TableHeader>)}
                </tr>
            </thead>
            <tbody>
                {
                    datas && datas.map((data) => <EventRows data={data}
                        fecthEvent={fecthEvent}
                        setSelectedEvent={setSelectedEvent}
                        setOpenModif={setOpenModif} />)
                }
            </tbody>
        </table>
    </div>
}