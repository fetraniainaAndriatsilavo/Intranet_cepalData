import HistoricRow from "../Gestion des Conges/HistoricRow";
import Demande from "./Demande";
import TableHeader from "./TableHeader";

export default function Table({ listHeader, datas, type }) {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-center rtl:text-right text-gray-500 ">
        <thead className="text-xs  uppercase bg-gray-50">
          <tr>
            {listHeader.map((list) => <TableHeader colsName={list}></TableHeader>)}
          </tr>
        </thead>
        <tbody>
          {
            type == 'historic' && datas && datas.map((data) => <HistoricRow data={data}> </HistoricRow>)
          }
          {
            type == 'validation' && datas && datas.map((data) => <Demande data={data}> </Demande>)
          }
        </tbody>
      </table>
    </div>
  );
}
