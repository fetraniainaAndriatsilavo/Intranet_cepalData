import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputLabel,
    TextField,
    FormControl,
    NativeSelect,
    Button,
    Alert,
    Autocomplete,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import api from "../../components/axios";

export default function CreateTimeSheet({ open, onClose }) {
    const { user } = useContext(AppContext);

    const [clients, setClients] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        user_id: user?.id ?? null,
        client: "",
        projet: "",
        type: "tache",
        date: "",
        nb_hour: "",
        description: "",
        ts_period_id: null,
        updated_by: user?.id ?? null, // Added for consistency
    });

    const clientOptions = clients.map(client => ({
        ...client,
        label: client.name
    }));

    const duration = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8];

    const handleChange = (e) => {
        const { id, value, name } = e.target;
        setFormData(prev => ({
            ...prev,
            [id || name]: value
        }));
    };

    function convertIntoTime(n) {
        let totalMinutes = Math.round(n * 60);
        let hours = Math.floor(totalMinutes / 60);
        let minutes = totalMinutes % 60;

        return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0") + ":00";
    }

    useEffect(() => {
        api.get("/timesheet-periods/all")
            .then((response) => {
                const activeSessions = response.data.filter(
                    (session) => session.status === "active"
                );
                console.log(activeSessions)
                if (activeSessions.length > 0) {
                    const latestActive = activeSessions[activeSessions.length - 1];
                    setFormData((prev) => ({
                        ...prev,
                        ts_period_id: latestActive.id,
                    }));
                }
            })
            .catch((error) => {
                console.error("Error fetching timesheet periods:", error);
            });
    }, []);


    // Fetch clients
    useEffect(() => {
        api.get("/data")
            .then((response) => {
                setClients(response.data.clients || []);
            })
            .catch((error) => {
                console.error(error);
                setError("Erreur lors du chargement des clients.");
            });
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await api.post("/timesheet/store", formData, {
                headers: { "Content-Type": "application/json" }
            });
            setFormData({
                user_id: user?.id ?? null,
                client: "",
                projet: "",
                type: "tache",
                date: "",
                nb_hour: "",
                description: "",
                ts_period_id: null,
                updated_by: user?.id ?? null
            });
            setSuccess(response.data.message);
            setError(null);
            setTimeout(() => {
                onClose();
            }, 3000);
        } catch (err) {
            if (err.response?.status === 422) {
                setError(err.response.data.message);
            } else {
                setError("Erreur lors de l'enregistrement.");
            }
            setSuccess(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
                        <path d="M16 3v4" />
                        <path d="M8 3v4" />
                        <path d="M4 11h16" />
                        <path d="M7 14h.013" />
                        <path d="M10.01 14h.005" />
                        <path d="M13.01 14h.005" />
                        <path d="M16.015 14h.005" />
                        <path d="M13.015 17h.005" />
                        <path d="M7.01 17h.005" />
                        <path d="M10.01 17h.005" />
                    </svg>
                    <h1 className="text-xl font-semibold">
                        Création de feuille de temps Journalière
                    </h1>
                </div>
            </DialogTitle>

            <DialogContent dividers>
                <div className="flex gap-4 mb-4">
                    <Autocomplete
                        fullWidth
                        disablePortal
                        options={clientOptions}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) => option.code === value.code}
                        renderInput={(params) => (
                            <TextField {...params} label="Client" size="small" fullWidth />
                        )}
                        value={clientOptions.find(c => c.code === formData.client) || null}
                        onChange={(e, value) =>
                            setFormData({ ...formData, client: value ? value.code : "" })
                        }
                    />
                    <TextField
                        id="projet"
                        label="Projets"
                        variant="outlined"
                        value={formData.projet}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                    />
                </div>

                <FormControl fullWidth className="mb-4">
                    <InputLabel variant="standard" htmlFor="type">Type</InputLabel>
                    <NativeSelect
                        value={formData.type}
                        onChange={handleChange}
                        inputProps={{ name: "type", id: "type" }}
                    >
                        <option value="tache">Tâches</option>
                        <option value="conges">Congés</option>
                        <option value="ferie">Fériés</option>
                        <option value="recuperation">Récupération</option>
                        <option value="repos medical">Repos Médical</option>
                    </NativeSelect>
                </FormControl>

                <div className="flex gap-4 mb-4 mt-4">
                    <TextField
                        id="date"
                        type="date"
                        label="Date"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        value={formData.date}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                    />
                    <Autocomplete
                        options={duration}
                        value={formData.nb_hour ? String(formData.nb_hour) : null}
                        onChange={(event, newValue) =>
                            setFormData({ ...formData, nb_hour: convertIntoTime(newValue) })
                        }
                        getOptionLabel={(option) => String(option)}
                        renderInput={(params) => (
                            <TextField {...params} label="Durée (heure)" />
                        )}
                        isOptionEqualToValue={(option, value) => option === value}
                        size="small"
                        fullWidth
                    />
                </div>

                <TextField
                    id="description"
                    type="text"
                    label="Description"
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                    size="small"
                    value={formData.description}
                    onChange={handleChange}
                    className="mb-4"
                />

                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </DialogContent>

            <DialogActions>
                <Button variant="outlined" onClick={() => {
                    setFormData({
                        user_id: user?.id ?? null,
                        client: "",
                        projet: "",
                        type: "tache",
                        date: "",
                        nb_hour: "",
                        description: "",
                        ts_period_id: null,
                        updated_by: user?.id ?? null, // Added for consistency
                    })
                    onClose()
                }}>Annuler</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
