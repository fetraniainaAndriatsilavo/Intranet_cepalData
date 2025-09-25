import { useState } from "react";
import {
  TextField,
  Alert,
  Modal,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import api from "../../../components/axios";

export default function CreateEvent({ fecthEvent, open, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
  });

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setSuccess(null);
    setError(null);
    setLoading(true);
    if (!formData.date && !formData.title && !formData.description) {
      setError('Vous devez remplir tous champs')
      setLoading(false)
      return;
    }
    else if (!formData.date) {
      setError('Veuillez inclure la date et l\'heure de l\'évènement')
      setLoading(false)
      return;
    }
    else if (!formData.title) {
      setError('Veuillez inclure le nom de l\'évènement')
      setLoading(false)
      return;
    }

    api.post('event/create', formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        setLoading(false)
        setSuccess(response.data.message)
        setError('')
        setFormData({ title: "", date: "", description: "" });
        setTimeout(() => {
          onClose();
        }, 1200);
        fecthEvent()
      })
      .catch((error) => {
        setLoading(false)
        setError(error.response?.data?.message)
      })
  };

  const cancel = () => {
    setFormData({ title: "", date: '', description: "" });
    setError(null);
    setSuccess(null);
    onClose();
  };


  return (
    <Modal open={open} onClose={cancel}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 420,
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 24,
          p: 1.5,
        }}
      >
        {/* Header */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          Nouvel Évènement
          <button
            onClick={cancel}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2rem",
              lineHeight: "1",
              marginLeft: "auto",
            }}
          >
            ✕
          </button>
        </Typography>

        {/* Form */}
        <TextField
          id="title"
          label="Titre **"
          variant="outlined"
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          value={formData.title}
          onChange={handleChange}
        />

        <TextField
          id="date"
          label="Date et heure **"
          type="datetime-local"
          fullWidth
          size="small"
          variant="outlined"
          sx={{ mb: 2 }}
          value={formData.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          id="description"
          label="Description"
          variant="outlined"
          multiline
          rows={3}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          value={formData.description}
          onChange={handleChange}
        />




        {/* Actions */}
        <div className="flex gap-2 mt-1">
          {/* <button
            className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded p-2 cursor-pointer"
            onClick={clear}
          >
            Réinitialiser
          </button> */}
          <button
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium rounded p-2 cursor-pointer flex items-center justify-center"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              // <CircularProgress size={20} sx={{ color: "white" }} />
              'Création en cours...'
            ) : (
              "Créer"
            )}
          </button>
        </div>
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
