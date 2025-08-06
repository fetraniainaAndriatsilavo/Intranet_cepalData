import {
    InputLabel,
    TextField,
    FormControl,
    NativeSelect,
    Button,
    Alert,
    Autocomplete,
} from "@mui/material";
import axios from "axios";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";

export default function ModifyTimeSheet({ sessionId, onclose }) {
    const { user } = useContext(AppContext);
    const {id} = useParams() 
    const [formData, setFormData] = useState({
        user_id: user.id ?? null,
        client: "",
        projet: "",
        type: "tache",
        date: "",
        heure: "",
        description: "",
        ft_periode_id: sessionId,
    });
    const [error, SetError] = useState(null);
    const [success, SetSuccess] = useState(null);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    const handleSubmit = () => {
        axios
            .post("http://127.0.0.1:8000/api/feuilles_de_temps/create", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                console.log(response);
                setFormData({
                    user_id: user.id ?? null,
                    client: "",
                    projet: "",
                    type: "tache",
                    date: "",
                    heure: "",
                    description: "",
                    ft_periode_id: sessionId,
                });
                SetSuccess(response.data.message);
                SetError(null);
                setTimeout(() => {
                    if (onclose) onclose();
                }, 3000);
            })
            .catch((error) => {
                if (error.response && error.response.status === 422) {
                    SetError(error.response.data.message);
                } else {
                    SetError("Erreur lors de l'enregistrement.");
                }
                SetSuccess(null);
            });
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded p-6 shadow">
            <div className="flex items-center justify-center gap-3 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-calendar-week">
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
                <h1 className="text-2xl font-semibold text-center">
                    Création de feuille de temps Journalière
                </h1>
            </div>

            <div className="flex gap-4 mb-4">
                <TextField
                    id="client"
                    label="Client"
                    variant="outlined"
                    value={formData.client}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    id="projet"
                    label="Projets"
                    variant="outlined"
                    value={formData.projet}
                    onChange={handleChange}
                    fullWidth
                />
            </div>

            <FormControl fullWidth className="mb-4">
                <InputLabel variant="standard" htmlFor="type">
                    Type
                </InputLabel>
                <NativeSelect
                    value={formData.type}
                    onChange={handleChange}
                    inputProps={{
                        name: "type",
                        id: "type",
                    }}
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
                />
                <Autocomplete
                    options={[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8]}
                    value={formData.heure}
                    onChange={(event, newValue) => setFormData({ ...formData, heure: newValue })}
                    renderInput={(params) => <TextField {...params} label="Durée (heure)" />}
                    isOptionEqualToValue={(option, value) => option === value}
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
                value={formData.description}
                onChange={handleChange}
                className="mb-4"
            />

            <div className="flex justify-end gap-4 mt-3">
                {onclose && (
                    <Button variant="outlined" onClick={onclose}>
                        Annuler
                    </Button>
                )}
                <Button variant="contained" onClick={handleSubmit}>
                    Enregistrer
                </Button>
            </div>

            {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    {success}
                </Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
        </div>
    );
}
