import { useState } from "react";
import { TextField, Alert } from "@mui/material";
import Calendar from "../../../Icons/icones/events.png";
import axios from "axios";

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
  });

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setSuccess(null);
    setError(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/event/create",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess(response.data.message);
      setTimeout(() => {
        setSuccess(null)
      }, [5000])
      setFormData({ title: "", date: "", time: "", description: "" });
    } catch (err) {
      console.error(err);
      setError(error.data.message);
      setTimeout(() => {
        setError(null)
      }, [5000])
    }
  };

  return (
    <div className="rounded bg-white w-full gap-4 p-5">
      <div className="flex flex-row items-center p-1">
        <img src={Calendar} className="w-8 h-8" alt="Events" />
        <h1 className="font-bold text-xl ml-2">Nouvel Evènement</h1>
      </div>

      <div className="mb-3 mt-3">
        <TextField
          id="title"
          label="Nom de l'Evenement "
          variant="outlined"
          fullWidth
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-row mb-3 mt-3 gap-4">
        <TextField
          id="date"
          label="Date"
          type="datetime-local"
          variant="outlined"
          value={formData.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
      </div>

      <div className="mb-3 mt-3">
        <TextField
          id="description"
          label="Description"
          variant="outlined"
          fullWidth
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center justify-center mt-3">
        <button
          className="p-3 bg-blue-500 text-white font-bold text-center cursor-pointer rounded hover:bg-blue-600 w-full"
          onClick={handleSubmit}
        >
          Créer
        </button>
      </div>

      {success && (
        <Alert severity="success" className="mt-3">
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" className="mt-3">
          {error}
        </Alert>
      )}
    </div>
  );
}
