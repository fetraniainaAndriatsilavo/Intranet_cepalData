import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";

export default function PublicDocuments() {
    const [type, setType] = useState('');

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
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                    <path d="M9 9h1" />
                    <path d="M9 13h6" />
                    <path d="M9 17h6" />
                </svg>
                <span>Documents publics</span>
            </div>

            {/* Document Type Selector */}
            <div className="mb-6 w-full md:w-1/2">
                <Autocomplete
                    disablePortal
                    options={['Fiche de Poste', 'Règlement intérieur', 'Note de Service']}
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
            </div>

            {/* File Upload */}
            <div className="flex items-center justify-center w-full">
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
