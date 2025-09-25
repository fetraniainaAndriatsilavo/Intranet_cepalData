import { useState } from "react";
import PrivateDocument from "./PrivateDocument";
import PublicDocuments from "./Public Documents";
import { Autocomplete, TextField } from "@mui/material";

export default function AjoutDocument({ documents }) {
    const [type, setType] = useState('public');
    return (
        <div className="bg-white w-1/2 rounded p-3 shadow-sm border border-gray-100 space-y-2">
            <Autocomplete
                disablePortal
                options={['public', 'personel']}
                value={type}
                onChange={(e, value) => {
                    setType(value)
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Type du document"
                        name="droit"
                        variant="outlined"
                        size="small"
                    />
                )}
                className="w-1/3 ml-3 mt-2"
            />
            {type === "public" ? <PublicDocuments documents={documents} /> : <PrivateDocument documents={documents} />}
        </div>
    );
}
