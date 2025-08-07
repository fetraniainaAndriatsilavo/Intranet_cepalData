import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Alert,
} from "@mui/material";
import { useState } from "react";
import api from "../../components/axios"; 

export default function Sessions({ open, onClose }) {
    const [formData, setFormData] = useState({
        periode: "",
        start_date: "",
        end_date: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setSuccess(null);
        setError(null);
        try {
            const response = await api.post("/timesheet-periods/store", formData);
            setSuccess(response.data.message);
            setFormData({ periode: "", start_date: "", end_date: "" });
            setTimeout(() => {
                if (onClose) onClose();
            }, 2000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Erreur inconnue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" />
                        <path d="M16 3v4" />
                        <path d="M8 3v4" />
                        <path d="M4 11h16" />
                    </svg>
                    <span className="text-xl font-semibold">
                        Créez une nouvelle session
                    </span>
                </div>
            </DialogTitle>

            <DialogContent dividers className="flex flex-col gap-4 mt-2">
                <TextField
                    label="Période (YYYY-MM) **"
                    type="month"
                    name="periode"
                    value={formData.periode}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                />

                <TextField
                    label="Date de début **"
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                />

                <TextField
                    label="Date de fin **"
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                />

                {success && (
                    <Alert severity="success">{success}</Alert>
                )}
                {error && (
                    <Alert severity="error">{error}</Alert>
                )}
            </DialogContent>

            <DialogActions className="px-4 pb-4">
                <Button onClick={onClose} color="secondary">
                    Annuler
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
