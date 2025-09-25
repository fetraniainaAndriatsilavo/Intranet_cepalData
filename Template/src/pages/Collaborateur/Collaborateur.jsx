import { Alert, Autocomplete, Avatar, TextField } from "@mui/material";
import api from "../../components/axios";
import { useEffect, useState } from "react";

export default function Collaborateur() {
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        image: '',
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address: "",
        birth_place: '',
        birth_date: ' ',
        marital_status: '',
        gender: '',
        role: '',
        client_code: '',
        type: '',
        hire_date: '',
        employee_number: '',
        cnaps_number: '',
        departement_id: '',
        position_id: '',
        class_id: '',
        manager_id: '',
        leaving_date: '',
        children: [],
        marriedTo: '',
        status: 'active'
    });

    const [errorFields, setErrorFields] = useState([]);

    const handleProfileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePhoto(URL.createObjectURL(file));
            setForm((prev) => ({
                ...prev,
                image: file
            }));
        }
    };

    // retourne les data comme  clients/contract_type/departments/classification/managers 
    const [clients, setClients] = useState([])
    const [contract, setContract] = useState([])
    const [department, setDepartment] = useState([])
    const [positions, setPositions] = useState([])
    const [classification, setClassification] = useState([])
    const [managers, setManagers] = useState([])

    useEffect(() => {
        api.get("/data")
            .then((response) => {
                setClients(response.data.clients)
                setContract(response.data.contract_types)
                setPositions(response.data.positions)
                setDepartment(response.data.departments)
                setClassification(response.data.classifications)
                setManagers(response.data.managers)
            })
            .catch((error) => {
                alert(error.response.message)
            })
    }, []);

    const positionOptions = Object.entries(positions).map(([id, label]) => ({
        id: parseInt(id),
        label
    }));

    const departementOptions = Object.entries(department).map(([id, label]) => ({
        id: parseInt(id),
        label
    }));

    const clientOptions = clients.map(client => ({
        ...client,
        label: client.name // This ensures the Autocomplete displays the name
    }));

    const classificationOptions = Object.entries(classification).map(([id, label]) => ({
        id: parseInt(id),
        label
    }));

    // soumettre la création d'utilisateur 
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const Enregistrer = async (e) => {
        e.preventDefault();
        setLoading(true)
        const requiredFields = [
            "first_name",
            "last_name",
            "email",
            "role",
            "gender",
            "marital_status",
            "position_id",
            "type"
        ];
        const errors = requiredFields.filter((field) => !form[field]);
        setErrorFields(errors);
        setLoading(false)

        if (errors.length === 0) {
            setLoading(true)
            try {
                const response = await api.post("/register", form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                );
                console.log("Response from backend:", response.data);

                // Reset the form state to initial empty values
                setForm({
                    image: '',
                    first_name: "",
                    last_name: "",
                    email: "",
                    phone_number: "",
                    address: "",
                    birth_place: '',
                    birth_date: '',
                    marital_status: '',
                    gender: '',
                    role: '',
                    client_code: '',
                    type: '',
                    hire_date: '',
                    employee_number: '',
                    cnaps_number: '',
                    departement_id: '',
                    position_id: '',
                    class_id: '',
                    manager_id: ''
                });
                setProfilePhoto(null);
                setErrorFields([]);
                setError('')
                setSuccess(response.data.message)

                setTimeout(() => {
                    window.location.href = '/liste-utilisateur'
                }, 1500);
            } catch (error) {
                setError(error.response.data.message)
                setLoading(false)
            } finally {
                setLoading(false)
            }
        }
    };

    const clear = () => {
        setForm({
            image: '',
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            address: "",
            birth_place: '',
            birth_date: ' ',
            marital_status: '',
            gender: '',
            role: '',
            client_code: '',
            type: '',
            hire_date: '',
            employee_number: '',
            cnaps_number: '',
            departement_id: '',
            position_id: '',
            class_id: '',
            manager_id: '',
            leaving_date: '',
            children: [],
            marriedTo: '',
            status: 'active'
        })
        setLoading(false)
        setSuccess('')
        setError('')
    }
    return (
        <div className="bg-light flex justify-center">
            <div className="w-full max-w-6xl">
                {/* <div className="relative mb-20 rounded shadow overflow-hidden bg-white">
                    <div className="pt-3 px-6 pb-6">
                        <div className=" flex flex-col mb-2">
                            <Avatar
                                src={profilePhoto || "/src/images/utilisateur.png"}
                                alt="Profile"
                                sx={{ width: 96, height: 96, border: '4px solid white' }}
                            />
                        </div>
                        <label className="uppercase mt-2 bg-white text-sm px-4 py-2 rounded shadow cursor-pointer hover:bg-gray-100 border-2 border-sky-600 text-sky-600 hover:border-none hover:bg-sky-600 hover:text-white">
                            Ajouter
                            <input type="file" accept="image/*" name="image" id="image" className="hidden" onChange={handleProfileUpload} />
                        </label>
                    </div>
                </div> */}

                <div className="grid md:grid-cols-2 gap-2">
                    <div className="bg-white rounded shadow p-4 space-y-6">
                        <h4 className="text-xl font-semibold text-slate-800 border-b pb-2">
                            Informations personnelles
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                            <TextField
                                type="text"
                                label="Nom **"
                                size="small"
                                fullWidth
                                value={form.last_name}
                                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                                error={errorFields.includes("last_name")}
                            />
                            <TextField
                                type="text"
                                label="Prénom **"
                                size="small"
                                fullWidth
                                value={form.first_name}
                                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                                error={errorFields.includes("first_name")}
                            />
                            <Autocomplete
                                disablePortal
                                options={['user', 'admin', 'manager']}
                                renderInput={(params) => (
                                    <TextField {...params} label="Rôle **" size="small" error={errorFields.includes("role")} />
                                )}
                                value={form.role}
                                onChange={(e, value) => setForm({ ...form, role: value })}
                                className="w-1/2"
                            />
                            <TextField
                                type="text"
                                label="Adresse email **"
                                size="small"
                                fullWidth
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                error={errorFields.includes("email")}
                            />
                            <TextField
                                type="text"
                                label="Numéro de téléphone"
                                size="small"
                                fullWidth
                                value={form.phone_number}
                                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                            />

                            <TextField
                                type="text"
                                label="Adresse"
                                size="small"
                                fullWidth
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                            />
                            <div className="flex flex-row w-full gap-3">
                                <TextField
                                    type="date"
                                    label="Date de naissance"
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    value={form.birth_date}
                                    onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
                                />
                                <TextField
                                    type="text"
                                    label="Lieu de naissance"
                                    size="small"
                                    fullWidth
                                    value={form.birth_place}
                                    onChange={(e) => setForm({ ...form, birth_place: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-row w-full gap-3">
                                <Autocomplete
                                    disablePortal
                                    options={["male", "female"]}
                                    fullWidth
                                    renderInput={(params) => (
                                        <TextField {...params} name="genre" label="Genre **" size="small" fullWidth error={errorFields.includes("gender")} />
                                    )}
                                    value={form.gender}
                                    onChange={(e, value) => setForm({ ...form, gender: value })}
                                />

                                <Autocomplete
                                    disablePortal
                                    options={["marié(e)", "veuf(e)", "célibataire", "divorcé(e)"]}
                                    fullWidth
                                    renderInput={(params) => (
                                        <TextField {...params} name="genre" label="Situation matrimoniale **" size="small" error={errorFields.includes("marital_status")} />
                                    )}
                                    value={form.marital_status}
                                    onChange={(e, value) => setForm({ ...form, marital_status: value })}
                                />
                            </div>
                            {/* {
                                form.marital_status && form.marital_status == 'marié(e)' && <input
                                    type="text"
                                    placeholder="nom du conjoint **"
                                    className={`w-full form-input border rounded px-3 py-2 text-sm ${errorFields.includes("last_name") ? "border-red-500" : ""}`}
                                    value={form.marriedTo}
                                    onChange={(e) => setForm({ ...form, marriedTo: e.target.value })}
                                />
                            } */}
                        </div>
                    </div>

                    <div className="bg-white rounded shadow p-4 h-full flex flex-col justify-between">
                        <div className="flex-grow space-y-6">
                            <h4 className="text-xl font-semibold text-slate-800 border-b pb-2">
                                Informations professionnelles
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                <Autocomplete
                                    disablePortal
                                    options={managers || []} // full manager objects
                                    getOptionLabel={(option) => option.first_name || ''} // show first_name
                                    renderInput={(params) => (
                                        <TextField {...params} label="Manager" size="small" fullWidth />
                                    )}
                                    value={
                                        managers.find((manager) => manager.id === form.manager_id) || null
                                    }
                                    onChange={(e, value) => {
                                        setForm({ ...form, manager_id: value ? value.id : null })
                                    }
                                    }
                                />

                                <Autocomplete
                                    disablePortal
                                    options={clientOptions}
                                    getOptionLabel={(option) => option.label}
                                    isOptionEqualToValue={(option, value) => option.code === value.code}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Client"
                                            size="small"
                                            fullWidth
                                        />
                                    )}
                                    value={clientOptions.find(c => c.code === form.client_code) || null}
                                    onChange={(e, value) =>
                                        setForm({ ...form, client_code: value ? value.code : "" })
                                    }
                                />

                                <Autocomplete
                                    disablePortal
                                    options={contract ? contract : []}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Contrat **" size="small" fullWidth error={errorFields.includes("type")} />
                                    )}
                                    value={form.type}
                                    onChange={(e, value) => setForm({ ...form, type: value })}
                                />

                                <TextField
                                    type="date"
                                    label="Date d'embauche"
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    value={form.hire_date}
                                    onChange={(e) => setForm({ ...form, hire_date: e.target.value })}
                                />
                                {
                                    form.type && form.type == 'CDD' && <TextField
                                        type="date"
                                        label="Date de départ"
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                        value={form.leaving_date}
                                        onChange={(e) => setForm({ ...form, leaving_date: e.target.value })}
                                    />
                                }
                                <div className="flex flex-row w-full gap-3">
                                    <TextField
                                        type="text"
                                        label="Numéro Cnaps"
                                        size="small"
                                        fullWidth
                                        value={form.cnaps_number}
                                        onChange={(e) => setForm({ ...form, cnaps_number: e.target.value })}
                                    />


                                    <TextField
                                        type="text"
                                        label="Numéro matricule"
                                        size="small"
                                        fullWidth
                                        value={form.employee_number}
                                        onChange={(e) => setForm({ ...form, employee_number: e.target.value })}
                                    />
                                </div>
                                <div className="w-full flex flex-col">
                                    <Autocomplete
                                        disablePortal
                                        options={departementOptions || []}
                                        className="mb-3"
                                        renderInput={(params) => (
                                            <TextField {...params} label="Département" size="small" fullWidth name="departement" />
                                        )}
                                        value={departementOptions[form.departement_id - 1] || null}
                                        onChange={(e, value) => {
                                            const index = departementOptions.indexOf(value);
                                            setForm({
                                                ...form,
                                                departement_id: index >= 0 ? index + 1 : '', // 1-based ID
                                            });
                                        }}
                                    />

                                    <Autocomplete
                                        disablePortal
                                        options={positionOptions}
                                        getOptionLabel={(option) => option.label}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        className="mb-3"
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Poste occupé **"
                                                size="small"
                                                fullWidth
                                                name="position_id"
                                                error={errorFields.includes("position_id")}
                                            />
                                        )}
                                        value={positionOptions.find((p) => p.id === form.position_id) || null}
                                        onChange={(e, value) =>
                                            setForm({ ...form, position_id: value ? value.id : null })
                                        }
                                    />

                                    <Autocomplete
                                        disablePortal
                                        options={classificationOptions}
                                        getOptionLabel={(option) => option.label}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Classification"
                                                size="small"
                                                fullWidth
                                                name="classification"
                                            />
                                        )}
                                        value={classificationOptions.find(c => c.id === form.class_id) || null}
                                        onChange={(e, value) => {
                                            setForm({
                                                ...form,
                                                class_id: value ? value.id : ''
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            {
                                error && <Alert severity="error"> {error}</Alert>
                            }

                            {
                                success && <Alert severity="success"> {success}</Alert>
                            }
                        </div>

                        <div className="flex justify-end mt-4 gap-3">
                            <button className="px-3 py-2 border border-sky-600 text-sky-600 rounded uppercase cursor-pointer"
                                onClick={clear}
                            >
                                Effacer
                            </button>
                            <button className="px-3 py-2 bg-sky-600 text-white rounded uppercase cursor-pointer" onClick={Enregistrer}>
                                {loading == true ? 'Enregistrement en cours...' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
