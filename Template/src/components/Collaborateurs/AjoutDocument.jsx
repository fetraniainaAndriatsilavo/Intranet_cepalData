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
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)} 
                    className="rounded-lg"
                >
                    <option value="public">public</option>
                    <option value="personel">personel</option>
                </select>
            </div>

            {/* Dynamic Form Section */}
            <div className="w-full">
                {type === 'public' ? <PublicDocuments /> : <PrivateDocument />}
            </div>
        </div>
    );
}
