import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  TextareaAutosize,
  Alert,
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
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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

  const cancel = () => {
    setTask({
      title: '',
      sprint_id: '',
      project_id: projectId || 0,
      type: 'Task',
      status: 'To-Do',
      user_allocated_id: '',
      description: '',
      due_date: '',
      priority: 'Medium'
    })
    setLoading(false)
    setError('')
    setSuccess('')
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!task.title) {
      setError('Le nom de la tâche est requis')
      setLoading(false)
      return;
    }

    if (!task.description) {
      setError('Veuillez élaborer une explication concernant ce tâche')
      setLoading(false)
      return;
    }

    if (!task.due_date) {
      setError('La date limite du est requise')
      setLoading(false)
      return;
    }

    if (!task.user_allocated_id) {
      setError('une personne doit être assignée à ce tâche')
      setLoading(false)
      return;
    }

    if (!task.type) {
      setError('quel type voulez-vous assigné à ce tâche ?')
      setLoading(false)
      return;
    }

    if (!task.status) {
      setError('le status du tâche est requis')
      setLoading(false)
      return;
    }

    setLoading(true)
    api.post('/tasks', task, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        fetchTaskProject(projectId) 
        setSuccess(response.data.message)
        onClose()
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
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
            width: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2.5,
            borderRadius: 1,
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
            Création d'une nouvelle tâche
          </Typography>

          {/* <form onSubmit={handleSubmit}> */}
          <TextField
            label="Nom de la tâche"
            fullWidth
            margin="normal"
            value={task.title}
            onChange={handleChange('title')}
            size="small"
          />

          <Autocomplete
            disablePortal
            options={allUsers || []}
            getOptionLabel={(option) => option.last_name + ' ' + option.first_name || ""}
            value={allUsers.find((u) => u.id === task.user_allocated_id) || null}
            onChange={(event, newValue) =>
              setTask((prev) => ({ ...prev, user_allocated_id: newValue ? newValue.id : null }))
            }
            renderInput={(params) => <TextField {...params} label="Personne assignée" />}
            size="small"
            className="mt-3"
          />


          <TextField
            label="fin de la tâche"
            type='date'
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
            value={task.due_date}
            onChange={handleChange('due_date')}
            size="small"
          />

          <div className="mt-3 mb-3 flex flex-col">
            <select
              className="rounded"
              id="type"
              value={task.type}
              onChange={handleChange('type')}
            >
              <option value="Story"> Stories </option>
              <option value="Task"> Tâches </option>
              <option value="Bug"> Bug </option>
              <option value="Sub_Task"> Sous-tâches </option>
            </select>
          </div>

          <div className="flex flex-col">
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
            aria-label="Description"
            minRows={3}
            placeholder="Description"
            className="mt-3 rounded w-full resize-none"
            value={task.description}
            onChange={handleChange('description')}
          />
          <div className='mt-1'>
            {
              error && <Alert severity='error'>
                {error}
              </Alert>
            }
            {
              success && <Alert severity='success'>
                {success}
              </Alert>
            }
          </div>
          <div className="w-full flex flex-row gap-2 mt-3">
            <button className="px-3 w-1/3 py-2 bg-white border border-sky-600 text-sky-600 rounded cursor-pointer" onClick={() => {
              cancel()
            }} type='reset'>
              Annuler
            </button>
            <button className="px-3 py-2 w-2/3 bg-sky-600 text-white rounded cursor-pointer" onClick={(e) => {
              handleSubmit(e)
            }}>
              {loading ? 'En cours d\' enregistrement' : 'Créer'}
            </button>
          </div>
          {/* </form> */}
        </Box>
      </Modal>
    </>
  );
}
