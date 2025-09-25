import { useContext, useEffect, useState } from "react";
import {
    TextField,
    Autocomplete,
    Alert,
} from "@mui/material";
import api from "../../axios";
import { AppContext } from "../../../context/AppContext";

export default function Createprojet() {
    const { user } = useContext(AppContext)
    const [form, setForm] = useState({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        project_lead_id: user? user.id : 0,
        client_code: "",
        type: '',
        status: ''
    });
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(null)
    const [managers, setManagers] = useState([]);
    const [clients, setClients] = useState([]);

    useEffect(() => {
        api.get("/data")
            .then((response) => {
                setClients(response.data.clients)
                setManagers(response.data.managers)
            })
            .catch((error) => {
                alert(error.response.message)
            })
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const cancel = () => {
        setForm({
            name: "",
            description: "",
            start_date: "",
            end_date: "",
            project_lead_id: user? user.id : 0,
            client_code: "",
            type: '',
            status: ''
        })
        setError('')
        setSuccess('')
        setLoading(false)
    }

    const Creer = async () => {
        if (!form.name) {
            setError('Le nom du projet est requis')
            setLoading(false)
            return;
        }

        if (!form.status) {
            setError('Veuillez préciser le status du projet')
            setLoading(false)
            return;
        }

        if(!form.start_date){
            setError('La date de début du projet est requise')
            setLoading(false)
            return;
        } 

        if(!form.client_code){
            setError('Le client assigné à ce projet est requis')
            setLoading(false)
            return;
        }
        try {
            const response = await api.post('/projects/store',
                form
                , {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            setSuccess(response.data.message)
            window.location.href = '/mesprojets'
        } catch (error) {
            setError(error.response.data.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
            <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                    Lancez un nouveau projet
                </h1>
            </div>

            <div className="bg-white w-1/2 rounded-lg p-6 flex flex-col gap-3">
                <TextField
                    label="Nom du projet **"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                />

                <TextField
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                />

                <TextField
                    label="Type du projet"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                />

                <Autocomplete
                    options={['To-Do', 'Review', 'In-Progress', 'Deploy', 'Done']}
                    value={form.status || null}
                    onChange={(e, value) =>
                        setForm({ ...form, status: value || "" })
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Status **" size="small" />
                    )}
                />

                {/* <Autocomplete
                    options={managers}
                    getOptionLabel={(option) => option.first_name}
                    value={managers.find(m => m.id === form.project_lead_id) || null}
                    onChange={(e, value) =>
                        setForm({ ...form, project_lead_id: value?.id || "" })
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Chef de projet **" size="small" />
                    )}
                /> */}

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

                {/* <TextField
                    label="Date de fin **"
                    type="date"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                /> */}

                <Autocomplete
                    options={clients}
                    getOptionLabel={(option) => option.name}
                    value={clients.find(c => c.code === form.client_code) || null}
                    onChange={(e, value) =>
                        setForm({ ...form, client_code: value?.code || "" })
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Clients **" size="small" />
                    )}
                />
                <div>
                    {
                        success && <Alert severity="success">{success}</Alert>
                    }
                    {
                        error && <Alert severity="error"> {error}</Alert>
                    }
                </div>
                <div className="w-full flex flex-row gap-2">
                    <button className="px-3 w-1/3 py-2 bg-white border border-sky-600 text-sky-600 rounded cursor-pointer" onClick={(e) => {
                        cancel()
                    }}>
                        Effacer
                    </button>
                    <button className="px-3 py-2 w-2/3 bg-sky-600 text-white rounded cursor-pointer" onClick={() => {
                        Creer()
                    }}>
                        {loading ? 'En cours d\' enregistrement' : 'Enregistrer'}
                    </button>
                </div>

            </div>
        </div>
    );
}
