import { TextField, Chip, Box, Alert, Modal, Typography, Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import api from "../../axios";

export default function CreateChatGroup({ open, onClose, fetchGroupConversation }) {
    const { user } = useContext(AppContext)
    const [allUsers, setAllUsers] = useState([]);
    const [searchUser, setSearchUser] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [groupName, setGroupeName] = useState("");
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
        const formData = new FormData();

        selectedUsers.forEach((user, index) => {
            formData.append(`users[${index}]`, user.id);
        });

        formData.append("name", groupName);
        formData.append("admin_id", user.id);

        if (selectedUsers.length < 2) {
            setError('le groupe devrait contenir au moins trois (3) personnes.')
        }

        try {
            const response = await api.post("/message-groups", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setGroupeName("");
            SetSuccess(response.data.message);
            setLoading(false);

            setTimeout(() => {
                onClose();
            }, 1500);

            fetchGroupConversation(user.id)
        } catch (error) {
            console.error("Error creating post:", error);
            SetSuccess(false);
            setError(error.response.data.message);
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
                <Typography variant="h6" component="h2" gutterBottom>
                    Créer un groupe de discussion
                </Typography>

                <TextField
                    fullWidth
                    label="Nom du groupe"
                    variant="outlined"
                    className="mb-3"
                    value={groupName}
                    onChange={HandleChange}
                />

                <Box className="mt-4 rounded-md p-3 bg-white">
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
                        placeholder="Inviter vos amis à rejoindre votre groupe..."
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
                <div className="flex flex-row gap-2">
                    <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={cancel}
                        sx={{ mt: 2 }}
                    >
                        Fermer
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={HandleSubmit}
                        sx={{ mt: 2 }}
                    >
                        {loading ? "Création en cours..." : "Créer"}
                    </Button>
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
