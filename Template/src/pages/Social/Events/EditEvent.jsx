import { useEffect, useState } from "react";
import { TextField, Alert, Dialog } from "@mui/material";
import api from "../../../components/axios";

export default function EditEvent({ fecthEvent, open, onClose, eventId }) {
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        description: "",
    });

    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    const fetchEventInformation = (EventID) => {
        api.get('event/' + EventID + '/info')
            .then((response) => {
                const data = response.data.evenements
                setFormData({
                    title: data.title || "",
                    date: data.date || "",
                    description: data.description || "",
                })
            })
    }

    useEffect(() => {
        fetchEventInformation(eventId)
    }, [eventId])

    const handleSubmit = async () => {
        setSuccess(null);
        setError(null);
        setLoading(true)
        try {
            const response = await api.put(
                "event/update/" + eventId,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setLoading(false)
            setSuccess(response.data.message);
            setTimeout(() => {
                setSuccess(null)
            }, [5000])
            setFormData({ title: "", date: "", time: "", description: "" });
            onClose()
            fecthEvent()
        } catch (err) {
            setLoading(false)
            console.error(err);
            setError(error.data.message);
            setTimeout(() => {
                setError(null)
            }, [5000])
        }
    };

    return (
        <Dialog open={open} fullWidth>
            <div className="rounded bg-white w-full gap-4 p-5">
                <div className="title-group flex flex-row mb-3 mt-2 items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-calendar-event">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 5m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                        <path d="M16 3l0 4" />
                        <path d="M8 3l0 4" />
                        <path d="M4 11l16 0" />
                        <path d="M8 15h2v2h-2z" />
                    </svg>
                    <h1 className="font-bold mx-5 text-xl"> {eventId} Modification de l'Evènement </h1>
                </div>

                <div className="mb-3 mt-3">
                    <TextField
                        id="title"
                        label="Nom de l'Evenement "
                        variant="outlined"
                        fullWidth
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-row mb-3 mt-3 gap-4">
                    <TextField
                        id="date"
                        label="Date"
                        type="datetime-local"
                        variant="outlined"
                        value={formData.date}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                </div>

                <div className="mb-3 mt-3">
                    <TextField
                        id="description"
                        label="Description"
                        variant="outlined"
                        fullWidth
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex mt-3 w-full gap-3">
                    <button className="p-2 bg-gray-50 text-sky-700 font-bold text-center cursor-pointer rounded w-1/3 border border-sky-700"
                        onClick={onClose}>
                        FERMER
                    </button>
                    <button
                        className="p-2 bg-blue-500 text-white font-bold text-center cursor-pointer rounded hover:bg-blue-600 w-2/3"
                        onClick={handleSubmit}
                    >
                        MODIFIER
                    </button>
                </div>

                {success && (
                    <Alert severity="success" className="mt-3">
                        {success}
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" className="mt-3">
                        {error}
                    </Alert>
                )}
            </div>
        </Dialog>
    );
}
