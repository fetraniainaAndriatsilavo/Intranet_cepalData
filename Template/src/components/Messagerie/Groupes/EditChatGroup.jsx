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

    // Load group info
    useEffect(() => {
        if (!groupId) return;

        api
            .get(`/message-groups/${groupId}/info`)
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
    }, [groupId]);


    // Fetch all users
    useEffect(() => {
        api
            .get("/getUser/all")
            .then((res) => setAllUsers(res.data.users))
            .catch(console.error);
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
        setError(null);
        setSuccess(false);
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (selectedUsers.length < 2) {
            setError("Le groupe doit contenir au moins trois (3) personnes.");
            setLoading(false);
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
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 500,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Créer un groupe de discussion
                </Typography>

                {/* Group Name */}
                <TextField
                    fullWidth
                    label="Nom du groupe"
                    variant="outlined"
                    margin="normal"
                    value={group.name}
                    onChange={(e) =>
                        setGroup((prev) => ({ ...prev, name: e.target.value }))
                    }
                />

                {/* Selected Users */}
                <Box className="mt-4 rounded-md p-3 bg-white">
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
                        placeholder="Inviter vos amis..."
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
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Fermer
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Création en cours..." : "Créer"}
                    </Button>
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
