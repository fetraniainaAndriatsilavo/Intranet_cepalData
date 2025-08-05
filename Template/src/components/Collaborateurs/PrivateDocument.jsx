import { Autocomplete, Avatar, Box, Chip, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../axios";

export default function PrivateDocument() {
    const [type, setType] = useState('');
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [searchUser, setSearchUser] = useState('');

    useEffect(() => {
        api.get('/getUser/all')
            .then((response) => {
                setAllUsers(response.data.users);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleSelectUser = (user) => {
        if (users.length < 1) {
            setUsers([user]);
            setSearchUser('');
        }
    };

    const handleRemoveUser = () => {
        setUsers([]);
        suggestions = []
    };

    const suggestions = allUsers.filter((user) =>
        `${user.first_name} ${user.last_name ?? ''}`
            .toLowerCase()
            .includes(searchUser.toLowerCase()) &&
        !users.find((u) => u.id === user.id)
    );

    return (
        <div className="bg-white rounded-lg border p-6 w-full shadow-sm">
            {/* Header */}
            <div className="mb-6 flex items-center text-slate-700 gap-3 text-lg font-semibold">
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
                <span>Documents personnels</span>
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Document Type */}
                <Autocomplete
                    disablePortal
                    options={['CV', 'Fiche de paie', 'Diplômes', 'CIN', 'Certificat de Résidence']}
                    value={type}
                    onChange={(e, value) => setType(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Nom du document"
                            name="classification"
                            variant="outlined"
                            fullWidth
                        />
                    )}
                />

                {/* User Selection */}
                <Box className="rounded-md p-3 bg-white">
                    {users.length > 0 && (
                        <Box className="flex flex-wrap gap-2 mb-2">
                            {users.map((user) => {
                                const name = `${user.first_name} ${user.last_name ?? ''}`.trim();
                                return (
                                    <Chip
                                        key={user.id}
                                        label={name}
                                        onDelete={handleRemoveUser} // ✅ fixed
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

                            {suggestions.length > 0 && (
                                <ul className="border border-gray-200 rounded mt-2 max-h-40 overflow-auto bg-white z-10">
                                    {suggestions.map((user) => {
                                        const name = `${user.first_name} ${user.last_name ?? ''}`.trim();
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
            <div className="flex items-center justify-center w-full mt-4">
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
                    <input id="dropzone-file" type="file" />
                </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-4 gap-3">
                <button
                    className="px-3 py-2 border border-sky-600 text-sky-600 rounded uppercase cursor-pointer"
                    type="reset"
                >
                    Annuler
                </button>
                <button
                    className="px-3 py-2 bg-sky-600 text-white rounded uppercase cursor-pointer"
                >
                    Enregistrer
                </button>
            </div>
        </div>
    );
}
