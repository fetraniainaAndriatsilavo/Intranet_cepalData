import { TextField, Chip, Box, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../components/axios";

export default function CreateGroup({ userID, onClose, fetchUserGroup }) {
  const [allUsers, setAllUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [groupName, setGroupeName] = useState("");
  const [success, SetSuccess] = useState(false);
  const [error, setError] = useState(null);

  const HandleChange = (e) => {
    setGroupeName(e.target.value);
  };
  // Fetch users
  useEffect(() => {
    api
      .get("/getUser/all")
      .then((res) => setAllUsers(res.data.users))
      .catch(console.error);
  }, []);

  // Filter user suggestions
  useEffect(() => {
    if (searchUser.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = allUsers.filter(
        (user) =>
          (user.first_name.toLowerCase().includes(searchUser.toLowerCase())) &&
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

  const HandleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    selectedUsers.forEach((user, index) => {
      formData.append(`user_ids[${index}]`, user.id);
    });

    formData.append("name", groupName);
    formData.append("creator_id", userID);

    try {
      const response = await api.post(
        "/groups/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      setGroupeName("");
      SetSuccess(true);

      setTimeout(() => {
        onClose()
      }, [3000]) 
      
      fetchUserGroup(userID)
    } catch (error) {
      console.error("Error creating post:", error);
      SetSuccess(false);
      setError(error);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold"> Créer un groupe </h1>

      <TextField
        fullWidth
        label="Nom du groupe"
        variant="outlined"
        className="mb-3"
        onChange={HandleChange}
      />

      <Box className="mt-4 rounded-md p-3 bg-white">
        <Box className="flex flex-wrap gap-2 mb-2">
          {selectedUsers.map((user) => (
            <Chip
              key={user.id}
              label={user.first_name}
              onDelete={() => handleRemoveUser(user.id)}
              color="primary"
            />
          ))}
        </Box>

        <TextField
          fullWidth
          variant="standard"
          placeholder="Inviter vos amis à rejoindre votre groupe..."
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
                {user.first_name}
              </li>
            ))}
          </ul>
        )}
      </Box>

      <button
        className="w-full py-2 bg-sky-600 text-white font-semibold rounded hover:bg-sky-700 cursor-pointer"
        onClick={HandleSubmit}
      >
        Créer
      </button>

      {success && (
        <Alert severity="success">
          Votre groupe a été créeé avec succès.
        </Alert>
      )}
      {error && <Alert severity="error">{error} </Alert>}
    </div>
  );
}
