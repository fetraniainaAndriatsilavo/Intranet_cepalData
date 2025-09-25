import React, { useEffect, useState } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Autocomplete,
    TextareaAutosize,
    Alert,
    MenuItem,
    Divider,
} from "@mui/material";
import api from "../../axios";

export default function ViewTask({ open, onClose, id, projectId, fetchTaskProject }) {
    const [task, setTask] = useState({
        title: "",
        sprint_id: "",
        project_id: projectId || 0,
        type: "Task",
        status: "To-Do",
        user_allocated_id: "",
        description: "",
        due_date: "",
        priority: "Medium",
    });

    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchAllUsers = () => {
        api
            .get("/getUser/all")
            .then((response) => {
                setAllUsers(response.data.users);
            })
            .catch((err) => {
                console.error("Erreur lors du chargement des utilisateurs:", err);
            });
    }

    const fetchTaskInformation = (TaskId) => {
        api
            .get("/gettask/" + TaskId)
            .then((response) => {
                const data = response.data.data;
                setTask({
                    title: data.title || "",
                    sprint_id: data.sprint_id || "",
                    project_id: data.project_id || projectId || 0,
                    type: data.type || "Task",
                    status: data.status || "To-Do",
                    user_allocated_id: data.user_allocated_id || "",
                    description: data.description || "",
                    due_date: data.due_date || "",
                    priority: data.priority || "Medium",
                });
            })
            .catch((error) => {
                console.log(error.response?.data?.message || "Erreur lors du chargement de la tâche");
            });
    };

    useEffect(() => {
        if (projectId) {
            setTask((prev) => ({ ...prev, project_id: projectId }));
        }
    }, [projectId]);

    useEffect(() => {
        fetchAllUsers()
    }, [])

    useEffect(() => {
        fetchTaskInformation(id)
    }, [open, id]);


    const handleChange = (field) => (e) => {
        setTask((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const resetForm = () => {
        setTask({
            title: "",
            sprint_id: "",
            project_id: projectId || 0,
            type: "Task",
            status: "To-Do",
            user_allocated_id: "",
            description: "",
            due_date: "",
            priority: "Medium",
        });
        setError("");
        setSuccess("");
        setLoading(false);
    };

    const cancel = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async (TaskId) => {
        setError("");
        setSuccess("");
        if (!task.title) return setError("Le nom de la tâche est requis");
        if (!task.description) return setError("Veuillez ajouter une description");
        if (!task.due_date) return setError("La date limite est requise");
        if (!task.user_allocated_id) return setError("Veuillez assigner une personne");
        if (!task.type) return setError("Le type de tâche est requis");
        if (!task.status) return setError("Le statut est requis");

        setLoading(true);
        api.put('/taches/' + TaskId + '/update', task, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                fetchTaskProject(projectId);
                onClose();
            })
            .catch((error) => {
                setError(err.response?.data?.message || "Erreur lors de la création de la tâche");
            })
            .finally(() => {
                setLoading(false)
            })
    };

    return (
        <Modal open={open} onClose={cancel}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 500,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2,
                }}
            >
                {/* Header */}
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                        <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                        <path d="M10 14h4" />
                        <path d="M12 12v4" />
                    </svg>
                    <Typography variant="h6"> Aperçu et modification d'une tâche</Typography>
                </Box>
                {/* Form */}
                {/* <form onSubmit={handleSubmit}> */}
                    <TextField
                        label="Nom de la tâche"
                        fullWidth
                        margin="normal"
                        value={task.title}
                        onChange={handleChange("title")}
                        size="small"
                    />

                    <Autocomplete
                        disablePortal
                        options={allUsers || []}
                        getOptionLabel={(option) => `${option.last_name} ${option.first_name}` || ""}
                        value={allUsers.find((u) => u.id === task.user_allocated_id) || null}
                        onChange={(event, newValue) =>
                            setTask((prev) => ({
                                ...prev,
                                user_allocated_id: newValue ? newValue.id : null,
                            }))
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Personne assignée" margin="normal" size="small" />
                        )}
                    />

                    <TextField
                        label="Date limite"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        margin="normal"
                        value={task.due_date}
                        onChange={handleChange("due_date")}
                        size="small"
                    />

                    <TextField
                        label="Type"
                        select
                        fullWidth
                        margin="normal"
                        value={task.type}
                        onChange={handleChange("type")}
                        size="small"
                    >
                        <MenuItem value="Story">Story</MenuItem>
                        <MenuItem value="Task">Tâche</MenuItem>
                        <MenuItem value="Bug">Bug</MenuItem>
                        <MenuItem value="Sub_Task">Sous-tâche</MenuItem>
                    </TextField>

                    <TextField
                        label="Statut"
                        select
                        fullWidth
                        margin="normal"
                        value={task.status}
                        onChange={handleChange("status")}
                        size="small"
                    >
                        <MenuItem value="To-Do">To-Do</MenuItem>
                        <MenuItem value="In-Progress">In Progress</MenuItem>
                        <MenuItem value="Review">Review</MenuItem>
                        <MenuItem value="Deploy">Deploy</MenuItem>
                        <MenuItem value="Done">Done</MenuItem>
                    </TextField>

                    <TextareaAutosize
                        minRows={3}
                        placeholder="Description"
                        className="w-full mt-3 p-2 border rounded resize-none"
                        value={task.description}
                        onChange={handleChange("description")}
                    />

                    {/* Error / Success */}
                    {(error || success) && (
                        <Box mt={2}>
                            {error && <Alert severity="error">{error}</Alert>}
                            {success && <Alert severity="success">{success}</Alert>}
                        </Box>
                    )}
                    <div className="w-full flex flex-row gap-2 mt-3">
                        <button className="px-3 w-1/3 py-2 bg-white border border-sky-600 text-sky-600 rounded cursor-pointer" onClick={() => {
                            cancel()
                        }} type='reset'>
                            Annuler
                        </button>
                        <button className="px-3 py-2 w-2/3 bg-sky-600 text-white rounded cursor-pointer" onClick={() => {
                            handleSubmit(id)
                        }}>
                            {loading ? 'En cours de modification' : 'Modifier'}
                        </button>
                    </div>
                {/* </form> */}
            </Box>
        </Modal>
    );
}
