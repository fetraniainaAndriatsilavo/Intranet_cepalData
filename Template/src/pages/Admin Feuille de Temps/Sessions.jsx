import { TextField, Box, Alert, Modal, Typography, Button } from "@mui/material";
import { useState } from "react";
import api from "../../components/axios";

export default function Sessions({ open, onClose }) {
    const [form, setForm] = useState({
        periode: "",
        start_date: "",
        end_date: "",
    });

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const cancel = () => {
        setForm({ periode: "", start_date: "", end_date: "" });
        setError("");
        setSuccess("");
        setLoading(false)
        onClose();
    };

    const Creer = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!form.periode && !form.end_date && !form.start_date) {
            setError('Veuillez remplir tous les champs')
            setLoading(false)
            return;
        } else if (!form.end_date) {
            setError('la date clos de la session est nécessaire')
            setLoading(false)
            return;
        } else if (!form.start_date) {
            setError('la date de début de la session est nécessaire')
            setLoading(false)
            return;
        } else if (!form.periode) {
            setError('La période doit être renseignée')
            setLoading(false)
            return;
        }

        try {
            const response = await api.post("/timesheet-periods/store", form);
            setSuccess(response.data.message);
            setError("");
            setForm({ periode: "", start_date: "", end_date: "" });

            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur inconnue");
            setSuccess("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={cancel}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 420,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    boxShadow: 24,
                    p: 1.5,
                }}
            >
                {/* Header */}
                <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{
                        marginBottom: "20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    Créez une nouvelle session
                    <button
                        onClick={cancel}
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            marginLeft: "auto",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="hover:text-sky-600"
                        >
                            <title>Fermer la fenêtre</title>
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M18 6l-12 12" />
                            <path d="M6 6l12 12" />
                        </svg>
                    </button>
                </Typography>

                {/* Form */}
                <Box component="form" className="flex flex-col gap-4">
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

                    {/* Alerts */}
                    {success && (
                        <Alert severity="success" sx={{ mt: 1 }}>
                            {success}
                        </Alert>
                    )}
                    {error && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Buttons */}
                    <Box className="flex justify-end gap-2 mt-4">
                        <button
                            className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded p-1.5 cursor-pointer"
                            onClick={Creer}>
                            {loading ? "Enregistrement..." : "Enregistrer"}
                        </button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
