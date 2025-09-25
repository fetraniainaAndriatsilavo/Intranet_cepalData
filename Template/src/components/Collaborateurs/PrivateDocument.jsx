import { Alert, Autocomplete, Avatar, Box, Chip, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import api from "../axios";
import { AppContext } from "../../context/AppContext";

export default function PrivateDocument({ documents }) {
    const { user } = useContext(AppContext)
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [searchUser, setSearchUser] = useState('');

    const [docs, setDocs] = useState({
        user_id: '',
        doct_type_id: '',
        is_public: false,
        uploaded_by: user ? user.id : 0,
        file_path: '',
        file_name: ''
    })

    const [reporting, setReporting] = useState({
        success: '',
        error: '',
        loading: false
    })

    const fetchAllUser = () => {
        api.get('/getUser/all')
            .then((response) => {
                setAllUsers(response.data.users);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const handleSelectUser = (user) => {
        if (users.length < 1) {
            setUsers([user]);
            setDocs((prev) => ({ ...prev, user_id: user.id }))
            setSearchUser('');
        }
    };

    const handleRemoveUser = () => {
        setUsers([]);
        setDocs((prev) => ({ ...prev, user_id: null }))
    };

    const suggestions = allUsers.filter((user) =>
        `${user.last_name} ${user.first_name ?? ''}`
            .toLowerCase()
            .includes(searchUser.toLowerCase()) &&
        !users.find((u) => u.id === user.id)
    );

    const cancel = () => {
        setDocs({
            doct_type_id: '',
            is_public: false,
            file_path: '',
            file_name: ''
        })
        setReporting({
            success: '',
            error: '',
            loading: false
        })
        setUsers([])
    }

    const submit = async () => {

        if (!docs.doct_type_id) {
            setReporting({ success: "", error: "Le nom du document est requis", loading: false });
            return;
        }

        if (!docs.file_path && !docs.file_name) {
            setReporting({ success: "", error: "Veuillez importer un ficher", loading: false });
            return;
        }

        if (!docs.user_id) {
            setReporting({ success: "", error: "Un fichier doit être rattaché à une personne", loading: false });
            return;
        }

        setReporting({ success: "", error: "", loading: true });

        api.post('/documents-admin/upload', docs, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => {
                setReporting({
                    success: response.data.message,
                    error: "",
                    loading: false,
                });
                setDocs({
                    user_id: '',
                    doct_type_id: '',
                    is_public: false,
                    uploaded_by: user ? user.id : 0,
                    file_path: '',
                    file_name: ''
                })
            })
            .catch((error) => {
                setReporting({
                    success: "",
                    error: error.response.data.message,
                    loading: false,
                });
            })
        // .finally(() => {
        //     setReporting({
        //         success: "",
        //         error: '',
        //         loading: false,
        //     });
        // })
    }

    useEffect(() => {
        fetchAllUser()
    }, []);

    return (
        <div className="bg-white p-3 w-full">
            {/* Header */}
            <div className="mb-3 flex items-center text-slate-700 gap-3 text-lg font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="text-slate-600">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M13 3v4a.997 .997 0 0 0 1 1h4" />
                    <path d="M11 21h-5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v3.5" />
                    <path d="M8 9h1" />
                    <path d="M8 13h3" />
                    <path d="M8 17h2" />
                    <path d="M21 16c0 4 -2.5 6 -3.5 6s-3.5 -2 -3.5 -6c1 0 2.5 -.5 3.5 -1.5c1 1 2.5 1.5 3.5 1.5" />
                </svg>
                <span> Fichiers personnels </span>
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-1">
                {/* Document Type */}
                <Autocomplete
                    disablePortal
                    options={documents}
                    getOptionLabel={(option) => option.name}
                    value={documents.find((opt) => opt.id === docs.doct_type_id) || null}
                    onChange={(_, newValue) => {
                        setDocs((prev) => ({ ...prev, doct_type_id: newValue?.id || "", }));
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Nom du document"
                            name="classification"
                            variant="outlined"
                            size="small"
                        />
                    )}
                />

                {/* User Selection */}
                <Box className="rounded-md p-3 bg-white">
                    {users.length > 0 && (
                        <Box className="flex flex-wrap gap-2 mb-1">
                            {users.map((user) => {
                                const name = `${user.last_name} ${user.first_name ?? ''}`.trim();
                                return (
                                    <Chip
                                        key={user.id}
                                        label={name}
                                        onDelete={handleRemoveUser}
                                        avatar={<Avatar>{name.charAt(0).toUpperCase()}</Avatar>}
                                        color="primary"
                                    />
                                );
                            })}
                        </Box>
                    )}

                    {users.length < 1 && (
                        <>
                            <TextField
                                fullWidth
                                variant="standard"
                                placeholder="Ajouter une personne"
                                value={searchUser}
                                onChange={(e) => setSearchUser(e.target.value)}
                            />

                            {searchUser && suggestions.length > 0 && (
                                <ul className="border border-gray-200 rounded mt-2 max-h-40 overflow-auto bg-white z-10">
                                    {suggestions.map((user) => {
                                        const name = `${user.last_name} ${user.first_name ?? ''}`.trim();
                                        return (
                                            <li
                                                key={user.id}
                                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleSelectUser(user)}
                                            >
                                                {name}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </>
                    )}
                </Box>
            </div>

            {/* File Upload */}
            <div className="flex items-center justify-center w-full ">
                <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                        <svg
                            className="w-8 h-8 mb-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5A5.5 5.5 0 0 0 5.207 5.021A4 4 0 0 0 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                        </svg>
                        <p className="mb-2 text-sm font-medium">Cliquez pour importer</p>
                        <p className="text-xs">Formats acceptés : PDF, PNG, DOCX</p>
                    </div>
                    <input id="dropzone-file" type="file"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            console.log(file.name)
                            if (file) {
                                setDocs((prev) => ({ ...prev, file_path: file, file_name: file.name }))
                            }
                        }} />
                </label>
            </div>

            <div className="mt-1">
                {
                    reporting.error && <Alert severity="error">{reporting.error}</Alert>
                }

                {
                    reporting.success && <Alert severity="success">{reporting.success}</Alert>
                }
            </div>
            <div className="flex justify-center w-full mt-3 gap-3">
                <button className="px-3 py-2 border border-sky-600 text-sky-600 rounded w-1/3  cursor-pointer" type="reset"
                    onClick={cancel}>
                    Effacer
                </button>
                <button className="px-3 py-2 bg-sky-600 text-white rounded w-2/3 cursor-pointer"
                    onClick={submit}>
                    {
                        reporting.loading == true ? 'Import en cours...' : 'Importer'
                    }
                </button>
            </div>
        </div>
    );
}
