import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  TextareaAutosize,
} from '@mui/material';

export default function EditTask({ open, onClose }) {
  const [task, setTask] = useState({
    title: '',
    type: 'Task',
    status: 'To-Do',
    assigned_to: '',
    description: '',
  });

  const handleChange = (field) => (e) => {
    setTask((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.title.trim()) return;

    // You can pass task to onCreate here if needed
    console.log('Task created:', task);
    onClose();
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-file-pencil">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M14 3v4a1 1 0 0 0 1 1h4" />
              <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
              <path d="M10 18l5 -5a1.414 1.414 0 0 0 -2 -2l-5 5v2h2z" />
            </svg>
            Modifier cette Tâche
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
              options={['Jean', 'Marie', 'Lova']}
              value={task.assigned_to}
              onInputChange={(event, newValue) =>
                setTask((prev) => ({ ...prev, assigned_to: newValue }))
              }
              renderInput={(params) => <TextField {...params} label="Personne assignée" />}
              size="small"
              className="mt-3"
            />

            <div className="mt-3 mb-3 flex flex-col">
              <label htmlFor="type">Type :</label>
              <select
                className="rounded"
                id="type"
                value={task.type}
                onChange={handleChange('type')}
              >
                <option value="Stories">Stories</option>
                <option value="Task">Tâches</option>
                <option value="Bug">Bug</option>
                <option value="Sub-Task">Sous-tâches</option>
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
                <option value="In Progress">In Progress</option>
                <option value="Reviewing">Reviewing</option>
                <option value="Completed">Completed</option>
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
              <Button onClick={onClose} sx={{ mr: 1 }} variant="outlined">
                Retour
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Créez
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
}
