import { useEffect, useState } from "react";
import { TextField, Alert, Box, Chip } from "@mui/material";
import axios from "axios";
import api from "../../../components/axios";

export default function GroupEdit({ open, onClose, GroupId }) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const [group, setGroup] = useState({
    name: '',
    members: [],
    id: ''
  })

  const [searchUser, setSearchUser] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [allUsers, setAllUsers] = useState([]);


  useEffect(() => {
    api
      .get("/getMembersGroup/" + GroupId)
      .then((response) => {
        const group = response.data.group
        const members = response.data.members
        setGroup({
          id: group.id,
          name: group.name,
          members: members
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }, [GroupId]);


  useEffect(() => {
    if (searchUser.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchUser.toLowerCase()) &&
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

  const checkedUsers = [];
  selectedUsers.map((user) => checkedUsers.push(user.id));

  if (!open) return null;

  const HandleSubmit = async () => {
    const formData = new FormData();

    selectedUsers.forEach((user, index) => {
      formData.append(`user_ids[${index}]`, user.id);
    });

    if (!group.name.trim()) {
      setError("Le nom du groupe ne peut pas être vide.");
      return;
    } 
    
    formData.append("name", group.name);
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const response = await api.put(
        "/groups/" + GroupId + "/rename",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      setSuccess(response.data.message);
      setTimeout(() => {
        onClose();
      }, [3000]);
    } catch (err) {
      setError("Une erreur s’est produite lors de la mise à jour.");
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">

        <div className="flex items-center justify-between flex-row mb-5">
          <h1 className="text-xl font-bold">Modifier le Groupe</h1>
          <button
            className="text-gray-500 hover:text-black"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18 6l-12 12" />
              <path d="M6 6l12 12" /></svg>
          </button>
        </div>

        <TextField
          fullWidth
          label="Nom du groupe"
          variant="outlined"
          className="mb-6"
          value={group.name}
          onChange={() => {
            setGroup({
              ...group,
              name: e.target.value
            })
          }}
        />

        <Box className="mt-4 rounded-md p-3 bg-white">
          <Box className="flex flex-wrap gap-2 mb-2">
            {selectedUsers.map((user) => (
              <Chip
                key={user.id}
                label={user.name}
                onDelete={() => handleRemoveUser(user.id)}
                color="primary"
              />
            ))}
          </Box>
        </Box>

        <TextField
          fullWidth
          variant="standard"
          placeholder="Inviter d'autres contacts à rejoindre votre groupe..."
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
                {user.name}
              </li>
            ))}
          </ul>
        )}

        <button
          disabled={loading}
          className="cursor-pointer w-full py-2 bg-sky-600 text-white font-semibold rounded hover:bg-sky-700 disabled:opacity-60 mt-3"
          onClick={HandleSubmit}
        >
          {loading ? "Modification..." : "Modifier"}
        </button>

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
    </div>
  );
}
