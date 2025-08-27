import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  TextareaAutosize,
} from '@mui/material';
import api from '../../axios';

export default function CreateTask({ open, onClose, projectId, fetchTaskProject }) {
  const [task, setTask] = useState({
    title: '',
    sprint_id: '',
    project_id: projectId || 0,
    type: 'Task',
    status: 'To-Do',
    user_allocated_id: '',
    description: '',
    due_date: '',
    priority: 'Medium'
  });

  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false)

  const handleChange = (field) => (e) => {
    setTask((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };


  useEffect(() => {
    if (projectId) {
      setTask(prev => ({ ...prev, project_id: projectId }));
    }
  }, [projectId]);

  useEffect(() => {
    api.get('/getUser/all')
      .then((response) => {
        setAllUsers(response.data.users);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (!task.title.trim()) {
      alert("Veuillez entrer un titre de tâche");
      return;
    }
    try {
      const response = await api.post("/tasks", task, {
        headers: { "Content-Type": "application/json" },
      });
      setLoading(false)
      onClose();
      fetchTaskProject(projectId)
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error);
      alert("Impossible de créer la tâche");
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom className="flex flex-row gap-3 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-clipboard-plus">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
              <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
              <path d="M10 14h4" />
              <path d="M12 12v4" />
            </svg>
            Créer une nouvelle Tâche
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Titre du Tâches"
              fullWidth
              margin="normal"
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
              label="fin de la Tâches"
              type='date'
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
              value={task.due_date}
              onChange={handleChange('due_date')}
              size="small"
            />

            <div className="mt-3 mb-3 flex flex-col">
              <label htmlFor="type">Type :</label>
              <select
                className="rounded"
                id="type"
                value={task.type}
                onChange={handleChange('type')}
              >
                <option value="Story">Stories</option>
                <option value="Task">Tâches</option>
                <option value="Bug">Bug</option>
                <option value="Sub_Task">Sous-tâches</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="status">Status :</label>
              <select
                className="rounded"
                id="status"
                value={task.status}
                onChange={handleChange('status')}
              >
                <option value="To-Do">To-Do</option>
                <option value="In-Progress">In Progress</option>
                <option value="Review">Reviewing</option>
                <option value="Deploy"> Deploy </option>
                <option value="Done">Done</option>
              </select>
            </div>

            <TextareaAutosize
              aria-label="minimum height"
              minRows={3}
              placeholder="Description"
              className="mt-3 rounded w-full"
              value={task.description}
              onChange={handleChange('description')}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={() => {
                setTask({
                  title: '',
                  sprint_id: '',
                  project_id: '',
                  type: 'Task',
                  status: 'To-Do',
                  user_allocated_id: '',
                  description: '',
                  due_date: '',
                  priority: 'Medium'
                })
                onClose()
              }} sx={{ mr: 1 }} variant="outlined">
                Retour
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {
                  loading == true ? 'Création...' : 'Créer'
                }
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
}
