import { Autocomplete, Avatar, Chip, TextField } from "@mui/material";
import { useState } from "react";

export default function PrivateDocument() {
    const [type, setType] = useState('');
    const [users, setUsers] = useState([]);

    return (
        <div className="bg-white rounded-lg border p-6 w-full shadow-sm">
            {/* Header */}
            <div className="mb-6 flex items-center text-slate-700 gap-3 text-lg font-semibold">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-600"
                >
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
                        <TextField {...params} label="Nom du document" name="classification" variant="outlined" fullWidth />
                    )}
                />

                {/* User Chip Input */}
                <Autocomplete
                    multiple
                    freeSolo
                    options={['Messi', 'Ronaldo', 'Neymar', 'Griezmann', 'Odegaard']}
                    value={users}
                    onChange={(event, newValue) => setUsers(newValue)}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                key={index}
                                label={option}
                                variant="outlined"
                                {...getTagProps({ index })}
                                avatar={<Avatar>{option.charAt(0).toUpperCase()}</Avatar>}
                            />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Ajoutez une personne"
                            name="users"
                            variant="outlined"
                            fullWidth
                        />
                    )}
                />
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
                        <p className="mb-2 text-sm font-medium">
                            Cliquez pour importer
                        </p>
                        <p className="text-xs">Formats acceptés : PDF, PNG, DOCX</p>
                    </div>
                    <input id="dropzone-file" type="file" />
                </label>
            </div>
        </div>
    );
}
