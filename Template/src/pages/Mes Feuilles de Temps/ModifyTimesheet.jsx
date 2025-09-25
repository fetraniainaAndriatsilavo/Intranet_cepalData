import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    InputLabel, TextField, FormControl, NativeSelect,
    Button, Alert, Autocomplete,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import api from "../../components/axios";
import dayjs from "dayjs";

export default function ModifyTimeSheet({ open, onClose, id, fetchTimeSheetUser }) {
    const { user } = useContext(AppContext);

    const [clients, setClients] = useState([]);
    const [formData, setFormData] = useState(initialFormState());
    const [error, setError] = useState(null);
    const [warning, setWarning] = useState(null)
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false)
    const [projectList, setProjectList] = useState([])


    function initialFormState() {
        return {
            user_id: user?.id ?? null,
            client_code: "",
            project_id: "",
            type: "",
            date: "",
            nb_hour: "",
            description: "",
        };
    }

    function convertIntoTime(n) {
        const totalMinutes = Math.round(n * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
    }

    const fetchTimesheet = async (timesheetId) => {
        try {
            const response = await api.get(`/timesheet/${timesheetId}`);
            const data = response.data
            setFormData({
                user_id: user?.id ?? null,
                client: data.client_code || "",
                project_id: data.project_id || "",
                type: data.type,
                date: data.date ? dayjs(data.date).format("YYYY-MM-DD") : "",
                nb_hour: data.nb_hour || "",
                description: data.description || "",
            });
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Erreur inconnue";
            console.error("Erreur lors du chargement du timesheet:", errorMessage);
            setError(errorMessage);
        }
    };

    const fetchClients = async () => {
        try {
            const { data } = await api.get("/data");
            setClients(data.clients || []);
        } catch (err) {
            alert(err.response?.message || "Erreur de chargement des données");
        }
    };

    const fetchProjectUserList = (userId) => {
        api.get('/getProjectOrTask/' + userId)
            .then((response) => {
                setProjectList(response.data.projects)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // ---------- Lifecycle ----------
    useEffect(() => {
        if (id) fetchTimesheet(id);
    }, [id, open]);

    useEffect(() => {
        fetchClients();
        fetchProjectUserList(user.id)
    }, [user.id]);

    // ---------- Handlers ----------
    const handleChange = (e) => {
        const { id, value, name } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id || name]: value,
        }));
    };

    const handleSubmit = async () => {
        setLoading(true)
        if (!formData.client && !formData.date && !formData.description && !formData.nb_hour) {
            setError('Veuillez remplir les champs')
            setLoading(false)
            return;
        }

        if (!formData.client) {
            setError('Veuillez remplir les champs')
            setLoading(false)
            return;
        }

        if (!formData.date) {
            setError('La date de votre pointage est requise')
            setLoading(false)
            return;
        }

        if (!formData.description) {
            setError('Veuillez inscrire une explication de votre tâche')
            setLoading(false)
            return;
        }

        if (!formData.nb_hour) {
            setError('L\'horaire est requise')
            setLoading(false)
            return;
        }

        try {
            const { data } = await api.put(`/timesheet/${id}/update`, formData, {
                headers: { "Content-Type": "application/json" },
            });
            setLoading(false)

            if (!response.data.warning) {
                setFormData(initialFormState());
                setSuccess(response.data.message);
                setWarning(null)
                setError(null);
                onClose()
            } else {
                setWarning(response.data.warning)
                setError(null)
                setTimeout(() => {
                    onClose()
                }, 5000)
            }
            fetchTimeSheetUser(user.id)
        } catch (err) {
            setLoading(false)
            setError(err.response.data.message)
            setSuccess(null);
        }
    };

    const handleClose = () => {
        onClose();
        setError('')
        setSuccess('')
        setFormData(initialFormState());
    };

    const clientOptions = clients.map((client) => ({
        ...client,
        label: client.name,
    }));

    // ---------- Render ----------
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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
                        Modification de votre pointage journalier
                    </h1>
                </div>
            </DialogTitle>

            <DialogContent dividers>
                {/* Client & Projet */}
                <div className="flex gap-4 mb-4">
                    <Autocomplete
                        fullWidth
                        disablePortal
                        options={clientOptions}
                        getOptionLabel={(option) => option.label ?? ""}
                        isOptionEqualToValue={(option, value) => option.code === value.code}
                        renderInput={(params) => (
                            <TextField {...params} label="Client" size="small" fullWidth />
                        )}
                        value={clientOptions.find((c) => c.code === formData.client) || null}
                        onChange={(e, value) =>
                            setFormData((prev) => ({
                                ...prev,
                                client: value ? value.code : "",
                            }))
                        }
                    />

                    <Autocomplete
                        fullWidth
                        disablePortal
                        options={projectList || []}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField {...params} label="Projets" size="small" fullWidth />
                        )}
                        value={projectList.find(c => c.id === formData.project_id) || null}
                        onChange={(e, value) =>
                            setFormData({ ...formData, project_id: value ? value.id : "" })
                        }
                    />
                </div>

                {/* Type */}
                <FormControl fullWidth className="mb-4">
                    <InputLabel variant="standard" htmlFor="type">Type</InputLabel>
                    <NativeSelect
                        value={formData.type}
                        onChange={handleChange}
                        inputProps={{ name: "type", id: "type" }}
                    >
                        <option value="Tâche"> Tâches </option>
                        <option value="Absence"> Absence </option>
                        <option value="Congé"> Congés </option>
                        <option value="Jour férié"> Fériés </option>
                        <option value="Convalescence"> Convalescence </option>
                        <option value="Repos médical">Repos Médical </option>
                        <option value="Assistance maternelle"> Assistance maternelle </option>
                        <option value="Mise à pied"> Mise à pied </option>
                    </NativeSelect>
                </FormControl>

                {/* Date & Heure */}
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
                        options={[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8]}
                        value={formData.nb_hour}
                        onChange={(event, newValue) =>
                            setFormData((prev) => ({
                                ...prev,
                                nb_hour: newValue ? String(convertIntoTime(newValue)) : "",
                            }))
                        }
                        getOptionLabel={(option) => option.toString()}
                        renderInput={(params) => <TextField {...params} label="Durée (heure)" />}
                        isOptionEqualToValue={(option, value) => option === value}
                        size="small"
                        fullWidth
                    />
                </div>

                {/* Description */}
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

                {/* Alerts */}
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                {warning && <Alert severity="warning" sx={{ mt: 2 }}>{warning}</Alert>}
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </DialogContent>

            <DialogActions>
                <button className="p-2 rounded border border-sky-600 text-sky-600 cursor-pointer" onClick={handleClose}>
                    Annuler
                </button>
                <button className="p-2 rounded text-white bg-sky-600 cursor-pointer" onClick={handleSubmit}>
                    {loading ? "Modification..." : "Modifier"}
                </button>
            </DialogActions>
        </Dialog>
    );
}
