import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Autocomplete,
    TextareaAutosize,
    Divider,
    Chip,
} from '@mui/material';
import api from '../../axios';

export default function ViewTask({ open, onClose, id, projectId, fetchTaskProject }) {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [allUsers, setAllUsers] = useState([]);

    const [task, setTask] = useState({
        id: id,
        title: '',
        sprint_id: '',
        project_id: projectId || 0,
        type: 'Task',
        status: 'To-Do',
        user_allocated_id: '',
        description: '',
        due_date: '',
        priority: 'Medium',
        time: ''
    });

    useEffect(() => {
        api.get('/getUser/all')
            .then((response) => {
                setAllUsers(response.data.users);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        api.get('/gettask/' + id)
            .then((response) => {
                const data = response.data.data
                setTask({
                    id: data.id,
                    title: data.title,
                    project_id: data.project_id || ' ',
                    priority: data.priority || ' ',
                    user_allocated_id: data.user_allocated_id || ' ',
                    description: data.description || ' ',
                    due_date: data.due_date || ' ',
                    status: data.status,
                    sprint_id: data.sprint_id || ' ',
                    type: data.type,
                    time: data.time || ' ',
                })
            })
            .catch(() => {
            })

    }, [id])

    const handleChange = (field) => (e) => {
        setTask((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        if (!task.title.trim()) {
            alert("Veuillez entrer un titre de tâche");
            return;
        }
        try {
            const response = await api.put("/taches/" + id + "/update", task, {
                headers: { "Content-Type": "application/json" },
            });
            onClose();
            fetchTaskProject(projectId)
        } catch (error) {
            console.error("Erreur lors de la création de la tâche:", error);
            alert("Impossible de modifier la tâche");
        } finally {
            setLoading(false)
        }
    };


    const deleteTask = (TaskId) => {
        setDeleteLoading(true)
        api.delete('/taches/' + TaskId + '/delete')
            .then(() => {
                setTimeout(() => {
                    onClose();
                }, 1500);
                fetchTaskProject(projectId)
            })
            .catch(() => {
                setError('Vous n\’avez pas les permissions nécessaires pour supprimer cette tâche.')
            })
            .finally(() => {
                setDeleteLoading(false)
            })
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 900,
                    maxHeight: '90vh',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2,
                    overflowY: 'auto',
                }}
            >
                {/* Header */}
                <Box display="flex" alignItems="center" mb={2}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                        <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                    </svg>
                    <Typography variant="h6">Détails de la tâche</Typography>
                </Box>

                <Divider />

                <form onSubmit={handleSubmit}>
                    {/* Top Section */}
                    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3} mt={2}>
                        <TextField
                            label="Titre"
                            fullWidth
                            value={task.title}
                            onChange={handleChange('title')}
                            size="small"
                        />

                        <Autocomplete
                            disablePortal
                            options={allUsers || []}
                            getOptionLabel={(option) => option.first_name || ""}
                            value={allUsers.find((u) => u.id === task.user_allocated_id) || null}
                            onChange={(event, newValue) =>
                                setTask((prev) => ({ ...prev, user_allocated_id: newValue ? newValue.id : null }))
                            }
                            renderInput={(params) => <TextField {...params} label="Personne assignée" />}
                            size="small"
                            className="mt-3"
                        />

                        <TextField
                            label="Date limite"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={task.due_date}
                            onChange={handleChange('due_date')}
                            size="small"
                        />

                        <TextField
                            label="Priorité"
                            select
                            SelectProps={{ native: true }}
                            fullWidth
                            value={task.priority}
                            onChange={handleChange('priority')}
                            size="small"
                        >
                            <option value="Low"> Basse </option>
                            <option value="Medium"> Moyenne </option>
                            <option value="High"> Haute </option>
                        </TextField>
                    </Box>

                    {/* Status & Type */}
                    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3} mt={3}>
                        <TextField
                            label="Type"
                            select
                            SelectProps={{ native: true }}
                            value={task.type}
                            onChange={handleChange('type')}
                            size="small"
                        >
                            <option value="Story">Story</option>
                            <option value="Task">Task</option>
                            <option value="Bug">Bug</option>
                            <option value="Sub_Task">Sub-task</option>
                        </TextField>

                        <TextField
                            label="Statut"
                            select
                            SelectProps={{ native: true }}
                            value={task.status}
                            onChange={handleChange('status')}
                            size="small"
                        >
                            <option value="To-Do">To Do</option>
                            <option value="In-Progress">In Progress</option>
                            <option value="Review">Reviewing</option>
                            <option value="Deploy">Deploy</option>
                            <option value="Done">Done</option>
                        </TextField>
                    </Box>

                    {/* Description */}
                    <Box mt={3}>
                        <Typography variant="subtitle2" gutterBottom>
                            Description
                        </Typography>
                        <TextareaAutosize
                            minRows={4}
                            placeholder="Ajouter une description..."
                            className="w-full rounded border p-2"
                            value={task.description}
                            onChange={handleChange('description')}
                        />
                    </Box>

                    <Divider sx={{ my: 3 }}>
                    </Divider>

                    {/* Footer Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        {/* Left side */}
                        <Button onClick={(e) => {
                            e.preventDefault()
                            deleteTask(id)
                        }} variant="outlined" color="error">
                            {deleteLoading == true ? 'Suppresion...' : 'Supprimer'}
                        </Button>

                        {/* Right side */}
                        <Box>
                            <Button onClick={onClose} sx={{ mr: 1 }} variant="outlined">
                                Fermer
                            </Button>
                            <Button type="submit" variant="contained" color="primary">
                                {loading == true ? 'Sauvegarde en cours...' : 'Sauvegarder'}
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
}
