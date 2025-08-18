import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import TableFeuille from "../../components/Mes Feuilles/TableFeuille";

export default function ViewTimeSheet({ details, open, handleClose }) {
    const header = [
        "Date",
        "Temps passé",
        "Description",
    ]
    return <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
            <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-list-details">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M13 5h8" />
                    <path d="M13 9h5" />
                    <path d="M13 15h8" />
                    <path d="M13 19h5" />
                    <path d="M3 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                    <path d="M3 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                </svg>
                <h1 className="text-xl font-semibold">
                    Détails
                </h1>
            </div>
        </DialogTitle>
        <DialogContent dividers>
            <TableFeuille header={header} datas={details || []} type={'view'} />
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" onClick={handleClose}> Retour </Button>
        </DialogActions>
    </Dialog>
}