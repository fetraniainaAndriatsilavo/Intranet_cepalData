import { useState } from "react";
import HistoricRow from "../Gestion des Conges/HistoricRow";
import Demande from "./Demande";
import TableHeader from "./TableHeader";
import Reporting from "../Gestion des Conges/Reporting";
import UserDemandes from "./UserDemandes";

export default function Table({ listHeader, datas, type, fetchDemandes, setDetails, handleClickOpenModal }) {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false);
  };

  const [infos, setInfos] = useState(null)
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
            type == 'validation' && datas && datas.map((data) => <Demande data={data} setInfos={setInfos} setOpen={setOpen}> </Demande>)
          }
          {
            type == 'annulation' && datas && datas.map((data) => <UserDemandes data={data} setInfos={setInfos} setOpen={setOpen}
              handleClickOpenModal={handleClickOpenModal} setDetails={setDetails}
            > </UserDemandes>)
          }
        </tbody>
      </table>
      <div>
        <Reporting open={open} onClose={() => { handleClose() }} infos={infos} fetchDemandes={fetchDemandes} />
      </div>
    </div>
  );
}
