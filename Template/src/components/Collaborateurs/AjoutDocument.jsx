import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import PrivateDocument from "./PrivateDocument"; 
import PublicDocuments from "./Public Documents";
export default function AjoutDocument() {
    const [type, setType] = useState('public');

    return (
        <div className="bg-white w-full rounded-lg p-6 shadow-sm space-y-6">
            {/* Header Selection */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-slate-800">Ajouter un document</h2>

                <Autocomplete
                    disablePortal
                    className="w-full md:w-1/3"
                    options={['public', 'personel']}
                    value={type}
                    onChange={(e, value) => setType(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Type de Documents"
                            name="classification"
                            variant="outlined"
                            fullWidth
                        />
                    )}
                />
            </div>

            {/* Dynamic Form Section */}
            <div className="w-full">
                {type === 'public' ? <PublicDocuments /> : <PrivateDocument />}
            </div>
        </div>
    );
}
