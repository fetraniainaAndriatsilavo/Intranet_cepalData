import { TextField, Chip, Box, Alert, Modal, Typography, Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import api from "../../axios";

export default function CreateChatGroup({ open, onClose, fetchGroupConversation }) {
    const { user } = useContext(AppContext)

    const [allUsers, setAllUsers] = useState([]);
    const [searchUser, setSearchUser] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);

    // A propos du groupe 
    const [suggestions, setSuggestions] = useState([]);
    const [groupName, setGroupeName] = useState("");


    // utilités
    const [success, SetSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const HandleChange = (e) => setGroupeName(e.target.value);

    // Fetch users
    useEffect(() => {
        api
            .get("/getUser/all")
            .then((res) => setAllUsers(res.data.users))
            .catch(console.error);
    }, []);

    // Filter user suggestions
    useEffect(() => {
        if (searchUser.trim() === "") {
            setSuggestions([]);
        } else {
            const filtered = allUsers.filter(
                (user) =>
                    user.first_name.toLowerCase().includes(searchUser.toLowerCase()) &&
                    !selectedUsers.find((u) => u.id === user.id)
            );
            setSuggestions(filtered);
        }
    }, [searchUser, allUsers, selectedUsers]);

    const handleSelectUser = (user) => {
        setSelectedUsers([...selectedUsers, user]);
        setSearchUser("");
        setSuggestions([]);
    };

    const handleRemoveUser = (id) => {
        setSelectedUsers(selectedUsers.filter((u) => u.id !== id));
    };

    const cancel = () => {
        setGroupeName('')
        setSelectedUsers([])
        setError('')
        onClose()
    }


    const HandleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!groupName && selectedUsers.length < 1) {
            setError('Vous devez remplir ce champ')
            setLoading(false)
            return;
        } else if (!groupName) {
            setError('Le nom du groupe est requis pour continuer')
            setLoading(false)
            return;
        } else if (selectedUsers.length < 2 && groupName) {
            setError('Le groupe doit contenir au moins trois personnes')
            setLoading(false)
            return;
        }

        const formData = new FormData();
        selectedUsers.forEach((user, index) => {
            formData.append(`users[${index}]`, user.id);
        });

        formData.append("name", groupName);
        formData.append("admin_id", user.id);

        try {
            const response = await api.post("/message-groups", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setGroupeName("");
            setError('')
            setSelectedUsers([])

            SetSuccess(response.data.message);
            setLoading(false);

            setTimeout(() => {
                onClose();
            }, 1000);

            fetchGroupConversation(user.id)
        } catch (error) {
            console.error("Error creating post:", error);
            SetSuccess(false);
            setError(error.response.data.message);
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={cancel}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    boxShadow: 24,
                    p: 1.5,
                }}
            >
                <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    Créer un groupe de discussion
                    <button
                        onClick={cancel}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            marginLeft: 'auto',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
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
                            className="hover:text-sky-600"
                        >
                            <title> Fermer la fenêtre </title>
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M18 6l-12 12" />
                            <path d="M6 6l12 12" />
                        </svg>
                    </button>
                </Typography>

                <TextField
                    fullWidth
                    label="Nom du groupe"
                    variant="outlined"
                    size="small"
                    className="mb-1 bg-gray-50 border border-none"
                    value={groupName}
                    onChange={HandleChange}
                    sx={{
                        marginBottom: '20px'
                    }}
                />

                <Box className="mt-1 rounded-md p-1 bg-gray-50">
                    <Box className="flex flex-wrap gap-2 mb-2">
                        {selectedUsers.map((user) => (
                            <Chip
                                key={user.id}
                                label={user.first_name}
                                onDelete={() => handleRemoveUser(user.id)}
                                color="primary"
                            />
                        ))}
                    </Box>

                    <TextField
                        fullWidth
                        variant="standard" 
                        size="small"
                        placeholder="Inviter vos amis à rejoindre votre groupe..." 
                        className="bg-gray-50 p-1 "
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                    />

                    {suggestions.length > 0 && (
                        <ul className="border border-gray-200 rounded mt-2 max-h-40 overflow-auto bg-white z-10">
                            {suggestions.map((user) => (
                                <li
                                    key={user.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSelectUser(user)}
                                >
                                    {user.first_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </Box>
                <div className="flex flex-row gap-2 mt-3">
                    <button
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded p-1.5 cursor-pointer"
                        onClick={HandleSubmit}>
                        {loading ? "Création en cours..." : "Créer"}
                    </button>
                </div>


                {success && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        Votre groupe a été créé avec succès.
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </Box>
        </Modal>
    );
}
