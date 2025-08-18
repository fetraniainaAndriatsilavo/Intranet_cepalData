import { useState } from "react";
import Groupcard from "../Components/Groupcard";
import CreateGroup from "./CreateGroup";
import { Modal, Box } from "@mui/material";

export default function Grouplist({ userID, lists, fetchUserGroup }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="flex flex-col p-3 bg-white rounded-lg h-auto">
      <div className="title-group flex flex-row mb-3 mt-2 items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-world">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
          <path d="M3.6 9h16.8" />
          <path d="M3.6 15h16.8" />
          <path d="M11.5 3a17 17 0 0 0 0 18" />
          <path d="M12.5 3a17 17 0 0 1 0 18" />
        </svg>
        <h1 className="font-bold mx-5 text-xl"> Mes Groupes </h1>
      </div>

      <div className="create-group flex items-center justify-center border-y-1 p-4">
        <button
          className="px-1 py-2 text-sky-500 bg-sky-50 font-semibold rounded cursor-pointer"
          onClick={handleOpen}
        >
          + Créer un nouveau groupe
        </button>
      </div>

      <div className="your-group  mt-3">
        {lists && lists.length > 0 ? (
          lists.map((list, key) => (
            <Groupcard group={list} key={key}>
              {" "}
            </Groupcard>
          ))
        ) : (
          <span className="text-sm text-center flex items-center justify-center italic">
            Aucun groupe associé à votre profil. Explorez et rejoignez un groupe dès maintenant.
          </span>
        )}
      </div>

      {/* MUI Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          className="bg-white rounded-lg shadow-lg p-6"
          sx={{
            width: 400,
            margin: "100px auto",
            outline: "none",
            borderRadius: 2,
          }}
        >
          <CreateGroup userID={userID} onClose={handleClose} fetchUserGroup={fetchUserGroup} />
        </Box>
      </Modal>
    </div>
  );
}
