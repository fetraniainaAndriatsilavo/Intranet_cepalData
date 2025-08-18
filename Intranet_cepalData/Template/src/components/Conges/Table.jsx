import { useState } from "react";
import HistoricRow from "../Gestion des Conges/HistoricRow";
import Demande from "./Demande";
import TableHeader from "./TableHeader";
import { Alert, Snackbar } from "@mui/material";

export default function Table({ listHeader, datas, type, fetchDemandes}) {
  const [message, setMessage] = useState('')

  const [open, setOpen] = useState(false)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };


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
            type == 'validation' && datas && datas.map((data) => <Demande data={data} setMessage={setMessage} setOpen={setOpen} fetchDemandes={fetchDemandes}> </Demande>)
          }
        </tbody>
      </table>
      <div>
        {
          message && <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="success"
              variant="filled"
              sx={{ width: '75%' }}
            >
              {message}
            </Alert>
          </Snackbar>
        }
      </div>
    </div>
  );
}
