import { Alert, Autocomplete, Avatar, TextField } from "@mui/material";
import api from "../../components/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ModifCollaborateurs() {
    const { id } = useParams()
    const [profilePhoto, setProfilePhoto] = useState(null);

    const [form, setForm] = useState({
        image: profilePhoto ? profilePhoto : '',
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
        manager_id: ''
    });

    const [errorFields, setErrorFields] = useState([]);

    const handleProfileUpload = (e) => {
        const file = e.target.files[0];
        if (file) setProfilePhoto(URL.createObjectURL(file));
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

    const clientOptions = clients.map(client => ({
        ...client,
        label: client.name
    }));

    const classificationOptions = Object.entries(classification).map(([id, label]) => ({
        id: parseInt(id),
        label
    }));

    const departmentOptions = Object.entries(department).map(([id, name]) => ({
        id: parseInt(id),
        label: name,
    })); 

    //collecte les donnés de l'utilisateur 
    useEffect(() => {
        if (!id) return;

        api.get('/user/' + id + '/info')
            .then((response) => {
                const user = response.data.user;

                // const classOption = classificationOptions.find(c => c.label === user.classification_name);

                setForm({
                    image: user.image || '',
                    first_name: user.first_name || "",
                    email: user.email || "",
                    phone_number: user.phone_number || "",
                    address: user.address || "",
                    birth_place: user.birth_place || '',
                    birth_date: user.birth_date || '',
                    marital_status: user.marital_status || '',
                    gender: user.gender || '',
                    role: user.role || '',
                    client_code: user.client_code || '',
                    employee_number: user.employee_number || '',
                    cnaps_number: user.cnaps_number || '',
                    departement_id: user.department || '',
                    position_id: user.position_id || '',
                    class_id: user.classification_id || '',
                    manager_id: user.manager || '',
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);



    // soumettre la modification de l'utilisateur 
    const [error, setError] = useState('')
    
    const Modifier = async (e) => {
        e.preventDefault();

        const requiredFields = [
            "first_name",
            "last_name",
            "email",
            "role",
            "gender",
            "marital_status",
            "position_id",
        ];
        const errors = requiredFields.filter((field) => !form[field]);
        setErrorFields(errors);

        if (errors.length === 0) {
            try {
                const response = await api.put("/user/" + id + "/update", form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                );
                console.log("Response from backend:", response.data);

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

                setTimeout(() => {
                    window.location.href = '/liste-utilisateur'
                }, 250);

            } catch (error) {
                setError(error.response.data.message)
            }
        }
    };


    return (
        <div className="bg-light min-h-screen p-6 flex justify-center">
            <div className="w-full max-w-6xl">
                <div className="relative mb-20 rounded shadow overflow-hidden bg-white">
                    <div className="h-52 w-full bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1950&q=80')" }}>
                        <div className="absolute left-6 bottom-[-40px] flex flex-col items-center">
                            <Avatar
                                src={profilePhoto || "https://i.pravatar.cc/150?img=32"}
                                alt="Profile"
                                sx={{ width: 96, height: 96, border: '4px solid white' }}
                            />
                        </div>
                    </div>
                    <div className="pt-16 px-6 pb-6">
                        <label className="uppercase mt-2 bg-white text-sm px-4 py-2 rounded shadow cursor-pointer hover:bg-gray-100 border-2 border-sky-600 text-sky-600 hover:border-none hover:bg-sky-600 hover:text-white">
                            Ajouter
                            <input type="file" accept="image/*" className="hidden" onChange={handleProfileUpload} />
                        </label>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 -mt-8">
                    <div className="bg-white rounded shadow p-6">
                        <h4 className="text-lg font-semibold mb-4 text-slate-700"> Personnelles </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Nom **"
                                className={`form-input border rounded px-3 py-2 text-sm ${errorFields.includes("last_name") ? "border-red-500" : ""}`}
                                value={form.last_name}
                                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Prénom **"
                                className={`form-input border rounded px-3 py-2 text-sm ${errorFields.includes("first_name") ? "border-red-500" : ""}`}
                                value={form.first_name}
                                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                            />
                            <Autocomplete
                                disablePortal
                                options={['user', 'admin', 'manager']}
                                renderInput={(params) => (
                                    <TextField {...params} label="Role **" size="small" fullWidth error={errorFields.includes("role")} />
                                )}
                                value={form.role}
                                onChange={(e, value) => setForm({ ...form, role: value })}
                            />
                            <input
                                type="email"
                                placeholder="Adresse email **"
                                className={`form-input border rounded px-3 py-2 col-span-2 text-sm ${errorFields.includes("email") ? "border-red-500" : ""}`}
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Numero de Téléphone"
                                className="form-input border rounded px-3 py-2 col-span-2 text-sm"
                                value={form.phone_number}
                                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Adresse"
                                className="form-input border rounded px-3 py-2 col-span-2 text-sm"
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                            />
                            <input
                                type="date"
                                placeholder="Date de Naissance"
                                className="form-input border rounded px-3 py-2 col-span-2 text-sm"
                                value={form.birth_date}
                                onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Lieu de Naissance"
                                className="form-input border rounded px-3 py-2 col-span-2 text-sm"
                                value={form.birth_place}
                                onChange={(e) => setForm({ ...form, birth_place: e.target.value })}
                            />
                            <div className="mb-4">
                                <p className="text-sm font-medium mb-2"> Genre **:  </p>
                                {["male", "female"].map((opt) => (
                                    <label key={opt} className="flex items-center gap-2 mb-1 text-sm">
                                        <input
                                            type="radio"
                                            name="genre"
                                            value={opt}
                                            checked={form.gender === opt}
                                            onChange={(e) => setForm({ ...form, gender: e.target.value })}
                                            className={`${errorFields.includes("gender") ? "ring-2 ring-red-500" : ""}`}
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                            <div className="mb-4">
                                <p className="text-sm font-medium mb-2"> Situation Matrimoniale ** :  </p>
                                {["marié(e)", "veuf(e)", "célibataire", "divorcé(e)"].map((opt) => (
                                    <label key={opt} className="flex items-center gap-2 mb-1 text-sm">
                                        <input
                                            type="radio"
                                            name="situation"
                                            value={opt}
                                            checked={form.marital_status === opt}
                                            onChange={(e) => setForm({ ...form, marital_status: e.target.value })}
                                            className={`${errorFields.includes("marital_status") ? "ring-2 ring-red-500" : ""}`}
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded shadow p-6 space-y-6 h-full flex flex-col justify-between">
                        <div className="flex-grow space-y-6">
                            <h4 className="text-xl font-semibold text-slate-800 border-b pb-2">
                                Professionnelles
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                <Autocomplete
                                    disablePortal
                                    options={managers || []} // full manager objects
                                    getOptionLabel={(option) => option.first_name || ''} // show first_name
                                    renderInput={(params) => (
                                        <TextField {...params} label="Managers" size="small" fullWidth />
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
                                        <TextField {...params} label="Contrat" size="small" fullWidth />
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
                                <div className="flex flex-row items-center gap-3 w-full">
                                    {/* ID */}
                                    <input
                                        type="text"
                                        placeholder="Numero Cnaps"
                                        className="form-input border rounded px-3 py-2 col-span-2 text-sm"
                                        value={form.cnaps_number}
                                        onChange={(e) => setForm({ ...form, cnaps_number: e.target.value })}
                                    />

                                    <input
                                        type="text"
                                        placeholder="Matricule ID"
                                        className="form-input border rounded px-3 py-2 col-span-2 text-sm"
                                        value={form.employee_number}
                                        onChange={(e) => setForm({ ...form, employee_number: e.target.value })}
                                    />
                                </div>
                                <div className="w-full flex flex-col">
                                    <Autocomplete
                                        disablePortal
                                        options={departmentOptions}
                                        getOptionLabel={(option) => option.label}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        className="mb-3"
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Département"
                                                size="small"
                                                fullWidth
                                                name="departement"
                                            />
                                        )}
                                        value={
                                            departmentOptions.find((d) => d.id === form.departement_id) || null
                                        }
                                        onChange={(e, value) => {
                                            setForm({
                                                ...form,
                                                departement_id: value ? value.id : "",
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
                                                label="Poste Occupé **"
                                                size="small"
                                                fullWidth
                                                name="poste"
                                                error={errorFields.includes("poste")}
                                            />
                                        )}
                                        value={positionOptions.find((p) => p.id === form.position_id) || null}
                                        onChange={(e, value) =>
                                            setForm({ ...form, position_id: value ? value.id : null })
                                        }
                                    />
                                </div>
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
                        <div>
                            {
                                error && <Alert severity="error"> {error}</Alert>
                            }
                        </div>

                        <div className="flex justify-end mt-4 gap-3">
                            <button className="px-3 py-2 border border-sky-600 text-sky-600 rounded uppercase cursor-pointer" type="reset">
                                Effacer
                            </button>
                            <button className="px-3 py-2 bg-sky-600 text-white rounded uppercase cursor-pointer hover:bg-sky-700" onClick={Modifier}>
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
