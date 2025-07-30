import { Autocomplete, Avatar, Button, TextField } from "@mui/material";
import { useState } from "react";

export default function Collaborateur() {
    const [profilePhoto, setProfilePhoto] = useState(null);

    const [form, setForm] = useState({
        nom: "",
        prenom: "",
        email: "",
        phone: "",
        adresse: "",
        lieuNaissance: '',
        dateNaissance: ' ',
        situation: '',
        genre: '',
        role: '',
        client: '',
        type: '',
        embaucheDate: '',
        matriculeId: '',
        CnapsNumber: '',
        departement: '',
        poste: '', 
        classification:''
    });


    const [settings, setSettings] = useState({
        visibility: "followers",
        taggable: "everyone",
        showFollowers: true,
        showEmail: true,
        showExperience: false,
    });

    // const handleCoverUpload = (e) => {
    //     const file = e.target.files[0];
    //     if (file) setCoverPhoto(URL.createObjectURL(file));
    // };

    const handleProfileUpload = (e) => {
        const file = e.target.files[0];
        if (file) setProfilePhoto(URL.createObjectURL(file));
    };

    return (
        <div className="bg-light min-h-screen p-6 flex justify-center">
            <div className="w-full max-w-6xl">
                {/* Cover and Profile Image */}
                <div className="relative mb-20 rounded shadow overflow-hidden bg-white">
                    {/* Cover Image */}

                    <div className="h-52 w-full bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1950&q=80')" }}>
                        {/* Profile Avatar */}
                        <div className="absolute left-6 bottom-[-40px] flex flex-col items-center">
                            <Avatar
                                src={profilePhoto || "https://i.pravatar.cc/150?img=32"}
                                alt="Profile"
                                sx={{ width: 96, height: 96, border: '4px solid white' }}
                            />
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="pt-16 px-6 pb-6">
                        {/* Modify Button */}
                        <label className="uppercase mt-2 bg-white text-sm px-4 py-2 rounded shadow cursor-pointer hover:bg-gray-100 border-2 border-sky-600 text-sky-600 hover:border-none hover:bg-sky-600 hover:text-white">
                            Ajouter
                            <input type="file" accept="image/*" className="hidden" onChange={handleProfileUpload} />
                        </label>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-2 gap-6 -mt-8">
                    {/* Personnelles */}
                    <div className="bg-white rounded shadow p-6">
                        <h4 className="text-lg font-semibold mb-4 text-slate-700"> Personnelles </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Nom "
                                className="form-input border rounded px-3 py-2 text-sm"
                                value={form.nom}
                                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Prénom"
                                className="form-input border rounded px-3 py-2 text-sm"
                                value={form.prenom}
                                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                            />
                            <Autocomplete
                                disablePortal
                                options={[]}
                                renderInput={(params) => (
                                    <TextField {...params} label="Role" size="small" fullWidth />
                                )}
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                            />
                            <input
                                type="email"
                                placeholder="Adresse email"
                                className="form-input border rounded px-3 py-2 col-span-2 text-sm"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Numero de Téléphone"
                                className="form-input border rounded px-3 py-2 col-span-2 text-sm"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            />

                            <input
                                type="text"
                                placeholder="Adresse"
                                className="form-input border rounded px-3 py-2 col-span-2 text-sm"
                                value={form.adresse}
                                onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                            />
                            <input
                                type="date"
                                placeholder="Date de Naissance"
                                className="form-input border rounded px-3 py-2 col-span-2 text-sm"
                                value={form.dateNaissance}
                                onChange={(e) => setForm({ ...form, dateNaissance: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Lieu de Naissance"
                                className="form-input border rounded px-3 py-2 col-span-2 text-sm"
                                value={form.lieuNaissance}
                                onChange={(e) => setForm({ ...form, lieuNaissance: e.target.value })}
                            />
                            <div className="mb-4">
                                <p className="text-sm font-medium mb-2"> Genre :  </p>
                                {["Masculin", "Féminin"].map((opt) => (
                                    <label key={opt} className="flex items-center gap-2 mb-1 text-sm">
                                        <input
                                            type="radio"
                                            name="genre"
                                            value={opt}
                                            checked={form.genre === opt}
                                            onChange={(e) => {
                                                setForm({ ...form, genre: e.target.value })
                                            }
                                            }
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                            <div className="mb-4">
                                <p className="text-sm font-medium mb-2"> Situation Matrimoniale :  </p>
                                {["Célibataire", "Marié(e)", "Divorcé(e)", "Veuf(ve)"].map((opt) => (
                                    <label key={opt} className="flex items-center gap-2 mb-1 text-sm">
                                        <input
                                            type="radio"
                                            name="situation"
                                            value={opt}
                                            checked={form.situation === opt}
                                            onChange={(e) => {
                                                setForm({ ...form, situation: e.target.value })
                                            }
                                            }
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* Professionnelles */}
                    <div className="bg-white rounded shadow p-6 space-y-6 h-full flex flex-col justify-between">
                        <div className="flex-grow space-y-6">
                            <h4 className="text-xl font-semibold text-slate-800 border-b pb-2">
                                Professionnelles
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                <Autocomplete
                                    disablePortal
                                    options={[]}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Client" size="small" fullWidth />
                                    )}
                                    value={form.client}
                                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                                />

                                <Autocomplete
                                    disablePortal
                                    options={[]}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Contrat" size="small" fullWidth />
                                    )}
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                />

                                <TextField
                                    type="date"
                                    label="Date d'embauche"
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                    value={form.embaucheDate}
                                    onChange={(e) => setForm({ ...form, embaucheDate: e.target.value })}
                                />

                                <div className="flex flex-row items-center gap-3 w-full">
                                    <input
                                        type="text"
                                        placeholder="Numero Cnaps"
                                        className="form-input border rounded px-3 py-2 col-span-2 text-sm"
                                        value={form.CnapsNumber}
                                        onChange={(e) => setForm({ ...form, CnapsNumber: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Matricule ID"
                                        className="form-input border rounded px-3 py-2 col-span-2 text-sm"
                                        value={form.matriculeId}
                                        onChange={(e) => setForm({ ...form, matriculeId: e.target.value })}
                                    />
                                </div>

                                <div className="w-full flex flex-col">
                                    <Autocomplete
                                        disablePortal
                                        options={[]}
                                        className="mb-3"
                                        renderInput={(params) => (
                                            <TextField {...params} label="Département" size="small" fullWidth name="departement" />
                                        )}
                                        value={form.departement}
                                        onChange={(e) => setForm({ ...form, departement: e.target.value })}
                                    />

                                    <Autocomplete
                                        disablePortal
                                        options={[]}
                                        className="mb-3"
                                        renderInput={(params) => (
                                            <TextField {...params} label="Poste Occupé" size="small" fullWidth name="poste" />
                                        )}
                                        value={form.poste}
                                        onChange={(e) => setForm({ ...form, poste: e.target.value })}
                                    />
                                </div>
                                <Autocomplete
                                    disablePortal
                                    options={[]}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Classification" size="small" fullWidth name="classification" />
                                    )}
                                    value={form.classification}
                                    onChange={(e) => setForm({ ...form, classification: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Bottom right aligned buttons */}
                        <div className="flex justify-end mt-4 gap-3">
                            <button className="px-3 py-2 border border-sky-600 text-sky-600 rounded uppercase cursor-pointer">
                                Annuler
                            </button>
                            <button className="px-3 py-2 bg-sky-600 text-white rounded uppercase cursor-pointer">
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
