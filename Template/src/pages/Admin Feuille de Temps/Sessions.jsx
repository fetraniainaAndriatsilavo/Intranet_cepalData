import {
    Alert,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import { useState } from "react";
import api from "../../components/axios";

export default function Sessions({ open, onClose }) {
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        periode: "",
        start_date: "",
        end_date: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleOpen = () => {
        setSuccess("");
        setError("");
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);

    };

    const Creer = async () => {
        try {
            const response = await api.post("/timesheet-periods/store", form);
            setSuccess(response.data.message);
            setError("");
            setForm({ periode: "", start_date: "", end_date: "" });
            setTimeout(() => {
                setOpen(false)
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur inconnue");
            setSuccess("");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Créez une nouvelle session</DialogTitle>

        <DialogContent className="flex flex-col gap-4 mt-2">
            <TextField
                label="YYYY-MM **"
                type="month"
                name="periode"
                value={form.periode}
                onChange={handleChange}
                fullWidth
                size="small"
            />

            <TextField
                label="Date de début **"
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
            />

            <TextField
                label="Date de fin **"
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
            />

            {success && <Alert severity="success">{success}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
        </DialogContent>

        <DialogActions className="px-4 pb-4">
            <Button onClick={() => {
                setForm({ periode: "", start_date: "", end_date: "" });
                onClose()
            }} variant="outliined" color="primary">
                Annuler
            </Button>
            <Button
                onClick={() => {
                    setLoading(true);
                    Creer();
                }}
                variant="contained"
                disabled={loading}
            >
                {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
        </DialogActions>
    </Dialog>
    );
}
