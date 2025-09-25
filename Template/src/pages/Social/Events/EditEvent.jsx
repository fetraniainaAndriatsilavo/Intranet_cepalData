import { useEffect, useState } from "react";
import {
  TextField,
  Alert,
  Modal,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import api from "../../../components/axios";
import dayjs from "dayjs";

export default function EditEvent({ fecthEvent, open, onClose, eventId }) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
  });

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError('')
    setSuccess('')
    setLoading(false)
  }, [open])

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const fetchEventInformation = async (EventID) => {
    try {
      const response = await api.get(`event/${EventID}/info`);
      const data = response.data.evenements || {};
      setFormData({
        title: data.title || "",
        date: data.date ? dayjs(data.date).format("YYYY-MM-DDTHH:mm") : "",
        description: data.description || "",
      });
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les informations de l’évènement.");
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEventInformation(eventId);
    }
  }, [eventId, open]);

  const handleSubmit = async () => {
    setSuccess(null);
    setError(null);
    setLoading(true);

    if (!formData.title) {
      setError("Veuillez inclure le nom de l'évènement.");
      setLoading(false);
      return;
    } else if (!formData.date) {
      setError("Veuillez inclure la date de l'évènement.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.put(`event/update/${eventId}`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccess(response.data.message || "Évènement modifié avec succès.");
      setLoading(false);

      setTimeout(() => {
        onClose();
      }, 1200);

      fecthEvent();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Une erreur est survenue.");
      setLoading(false);
    }
  };

  const cancel = () => {
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
          Modifier l'Évènement
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
          <button
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium rounded p-2 cursor-pointer flex items-center justify-center"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              //   <CircularProgress size={20} sx={{ color: "white" }} />  
              'Modification en cours...'
            ) : (
              "Modifier"
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
