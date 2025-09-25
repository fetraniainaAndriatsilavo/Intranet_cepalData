import {
    TextField,
    Chip,
    Box,
    Alert,
    Modal,
    Typography,
    Button,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import api from "../../axios";

export default function EditChatGroup({
    open,
    onClose,
    fetchGroupConversation,
    groupId,
}) {
    const { user } = useContext(AppContext);

    const [allUsers, setAllUsers] = useState([]);
    const [searchUser, setSearchUser] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [group, setGroup] = useState({
        id: groupId || 0,
        name: "",
        members: [],
        updated_by: 0,
        updated_at: "",
    });

    const fetchGroupInformation = (id) => {
        api
            .get(`/message-groups/${id}/info`)
            .then((res) => {
                const g = res.data.group;
                setGroup({
                    id: g.id,
                    name: g.name,
                    members: g.members,
                    updated_at: g.updated_at,
                    updated_by: g.updated_by,
                });

                setSelectedUsers(g.members)
            })
            .catch(() => { });
    }


    const fetchAllUser = () => {
        api
            .get("/getUser/all")
            .then((res) => setAllUsers(res.data.users))
            .catch(console.error);
    }

    // Load group info
    useEffect(() => {
        if (!groupId || !open) return;
        fetchGroupInformation(groupId)
    }, [groupId, open]);


    // Fetch all users
    useEffect(() => {
        fetchAllUser()
    }, []);

    // Filter suggestions
    useEffect(() => {
        if (!searchUser.trim()) {
            setSuggestions([]);
            return;
        }
        const filtered = allUsers.filter(
            (u) =>
                u.first_name.toLowerCase().includes(searchUser.toLowerCase()) &&
                !selectedUsers.some((sel) => sel.id === u.id)
        );
        setSuggestions(filtered);
    }, [searchUser, allUsers, selectedUsers]);

    const handleSelectUser = (u) => {
        setSelectedUsers((prev) => [...prev, u]);
        setSearchUser("");
        setSuggestions([]);
    };

    const handleRemoveUser = (id) => {
        setSelectedUsers((prev) => prev.filter((u) => u.id !== id));
    };

    const handleCancel = () => {
        setGroup({
            id: groupId || 0,
            name: "",
            members: [],
            updated_by: 0,
            updated_at: "",
        })
        setError(null);
        setSuccess(false);
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

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

        try {
            const formData = new FormData();
            selectedUsers.forEach((u, i) => {
                formData.append(`users[${i}]`, u.id);
            });
            formData.append("name", group.name);
            formData.append("admin_id", user.id);

            const res = await api.put("/message-groups/" + groupId, {
                name: group.name,
                updated_by: group.updated_by,
                members: group.members
            }, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setSuccess(res.data.message);
            setLoading(false);
            setTimeout(() => {
                onClose();
            }, 1500);

            fetchGroupConversation(user.id);
        } catch (err) {
            console.error("Error creating group:", err);
            setError(err.response?.data?.message || "Erreur lors de la création.");
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={handleCancel}>
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
                    Modification de votre groupe
                    <button
                        onClick={handleCancel}
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

                {/* Group Name */}
                <TextField
                    fullWidth
                    label="Nom du groupe"
                    variant="outlined"
                    margin="normal"
                    size="small"
                    className="mb-1 bg-gray-50 border border-2"
                    value={group.name}
                    onChange={(e) =>
                        setGroup((prev) => ({ ...prev, name: e.target.value }))
                    }
                    sx={{
                        marginBottom: '20px'
                    }}
                />

                {/* Selected Users */}
                <Box className="mt-1 rounded-md p-1 bg-gray-50"> 
                    <Box className="flex flex-wrap gap-2 mb-2">
                        {selectedUsers.map((u) => (
                            <Chip
                                key={u.id}
                                label={u.first_name}
                                onDelete={() => handleRemoveUser(u.id)}
                                color="primary"
                            />
                        ))}
                    </Box>

                    {/* Search Users */}
                    <TextField
                        fullWidth
                        variant="standard"
                        size="small"
                        placeholder="Inviter d'autres amis à vous rejoindre..."
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                    />

                    {/* Suggestions */}
                    {suggestions.length > 0 && (
                        <ul className="border border-gray-200 rounded mt-2 max-h-40 overflow-auto bg-white z-10">
                            {suggestions.map((u) => (
                                <li
                                    key={u.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSelectUser(u)}
                                >
                                    {u.first_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </Box>

                {/* Actions */}
                <Box className="flex flex-row gap-2 mt-3">
                    <button
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded p-1.5 cursor-pointer"
                        onClick={handleSubmit}>
                        {loading ? "Modification en cours..." : "Modifier"}
                    </button>
                </Box>

                {/* Alerts */}
                {success && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        {success}
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
