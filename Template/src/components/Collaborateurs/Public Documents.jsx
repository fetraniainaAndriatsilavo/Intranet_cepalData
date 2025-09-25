import { Alert, Autocomplete, TextField } from "@mui/material";
import { useContext, useState } from "react";
import api from "../axios";
import { AppContext } from "../../context/AppContext";

export default function PublicDocuments({ documents }) {
    const { user } = useContext(AppContext)
    const [docs, setDocs] = useState({
        doct_type_id: '',
        is_public: true,
        uploaded_by: user ? user.id : 0,
        file_path: '',
        file_name: ''
    })

    const [reporting, setReporting] = useState({
        success: '',
        error: '',
        loading: false
    })

    const cancel = () => {
        setDocs({
            doct_type_id: '',
            is_public: true,
            file_path: '',
            file_name: ''
        })
        setReporting({
            success: '',
            error: '',
            loading: false
        })
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

        setReporting({ success: "", error: "", loading: true });

        api.post('/documents-admin/upload', docs, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => {
                setDocs({
                    doct_type_id: '',
                    is_public: true,
                    uploaded_by: user ? user.id : 0,
                    file_path: '',
                    file_name: ''
                })
                setReporting({
                    success: response.data.message,
                    error: "",
                    loading: false,
                });
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

    return (
        <div className="bg-white p-3 w-full ">
            {/* Header */}
            <div className="mb-2 flex items-center text-slate-700 gap-3 text-lg font-semibold">
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
                <span> Fichiers publics </span>
            </div>

            {/* Document Type Selector */}
            <div className="mb-6 w-full md:w-1/2">
                <Autocomplete
                    disablePortal
                    options={documents}
                    getOptionLabel={(option) => option.name}
                    value={documents.find((opt) => opt.id === docs.doct_type_id) || null}
                    onChange={(_, newValue) => {
                        setDocs((prev) => ({ ...prev, doct_type_id: newValue?.id || "" }));
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
            </div>

            {/* File Upload */}
            <div className="flex items-center justify-center w-full">
                <label
                    htmlFor="dropzone-file_path"
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
