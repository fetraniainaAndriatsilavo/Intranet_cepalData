import {
  TextField,
  Chip,
  Box,
  Alert,
  Modal,
  Typography
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import api from "../../../components/axios";

export default function CreateGroup({ open, onClose, fetchUserGroup }) {
  const { user } = useContext(AppContext);

  const [allUsers, setAllUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [groupName, setGroupName] = useState("");

  // état de formulaire
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setGroupName(e.target.value);

  // récupérer tous les users
  useEffect(() => {
    api
      .get("/getUser/all")
      .then((res) => setAllUsers(res.data.users))
      .catch(console.error);
  }, []);

  // suggestions
  useEffect(() => {
    if (searchUser.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = allUsers.filter(
        (u) =>
          u.first_name.toLowerCase().includes(searchUser.toLowerCase()) &&
          !selectedUsers.find((sel) => sel.id === u.id)
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
    setGroupName("");
    setSelectedUsers([]);
    setSuccess('')
    setError(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // validations
    if (!groupName && selectedUsers.length < 1) {
      setError("Vous devez remplir ce champ");
      setLoading(false);
      return;
    } else if (!groupName) {
      setError("Le nom du groupe est requis pour continuer");
      setLoading(false);
      return;
    } else if (selectedUsers.length < 2) {
      setError("Le groupe doit contenir au moins trois personnes");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    selectedUsers.forEach((u, index) => {
      formData.append(`user_ids[${index}]`, u.id);
    });

    formData.append("name", groupName);
    formData.append("creator_id", user.id);

    try {
      const response = await api.post("/groups/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setGroupName("");
      setError(null);
      setSelectedUsers([]);
      setSuccess(response.data.message || "Votre groupe a été créé avec succès.");
      setLoading(false);

      setTimeout(() => {
        onClose();
      }, 1200);

      fetchUserGroup(user.id);
    } catch (err) {
      console.error("Error creating group:", err);
      setSuccess(false);
      setError(err.response?.data?.message || "Une erreur est survenue");
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={cancel}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 24,
          p: 2,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Créer votre groupe
          <button
            onClick={cancel}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            ✕
          </button>
        </Typography>

        <TextField
          fullWidth
          label="Nom du groupe"
          variant="outlined"
          size="small"
          value={groupName}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <Box className="mt-1 rounded-md p-1 bg-gray-50">
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

          <TextField
            fullWidth
            variant="standard"
            size="small"
            placeholder="Inviter vos amis à rejoindre votre groupe..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />

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

        <div className="flex flex-row gap-2 mt-3">
          <button
            className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded p-1.5 cursor-pointer"
            onClick={handleSubmit}
          >
            {loading ? "Création en cours..." : "Créer"}
          </button>
        </div>

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
