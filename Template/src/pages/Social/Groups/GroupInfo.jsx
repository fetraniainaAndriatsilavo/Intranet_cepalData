import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import GroupEdit from "./GroupEdit";
import api from "../../../components/axios";
import { useContext, useEffect, useState } from "react";
import CoverPhoto from "../../../images/360_F_467961418_UnS1ZAwAqbvVVMKExxqUNi0MUFTEJI83.jpg";
import { Delete, DeleteForever, Edit, ExitToApp } from "@mui/icons-material";
import { AppContext } from "../../../context/AppContext";
export default function GroupInfo({ GroupId }) {
  const { user } = useContext(AppContext)
  const [group, setGroup] = useState({
    name: '',
    members: [],
    id: ''
  })
  const [open, setOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const isOpen = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // save the button element
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClose = () => {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const fetchGroupInformation = (id) => {
    api
      .get("/getMembersGroup/" + id)
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
  }

  // generer les informations du groupe 
  useEffect(() => {
    fetchGroupInformation(GroupId)
  }, [GroupId, open]);


  // se quitter du groupe
  const leaveGroup = (id, userId) => {
    api
      .delete(
        "groups/" + id + "/members/" + userId + "/remove"
      )
      .then((response) => {
        window.location.href = '/social'
      })
      .catch((error) => {
        console.log(error);
      });
  };


  // suppression de groupe
  const deleteGroup = (id) => {
    api
      .delete(
        "groups/" + id
      )
      .then((response) => {
        window.location.href = '/social'
      })
      .catch((error) => {
        console.log(error);
      });
  }


  return (
    <div className="w-2/3">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="relative h-60 bg-gray-300">
          <img src={CoverPhoto} alt="Cover" className="w-full h-full object-cover" />
        </div>
        <div className="mt-5 px-6 pb-6 flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold flex gap-3 items-center">
              {group.name}
            </h1>
            <p className="text-gray-600"> {group.members.length}  Membres </p>
          </div>
          <div className="flex gap-3 items-center flex-row">
            <button className="cursor-pointer rounded bg-gray-100 p-1" onClick={handleClick}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-dots">
                <title> plus d'action </title>
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <>
        <Menu
          anchorEl={anchorEl}
          open={isOpen}
          onClose={handleClose}
          PaperProps={{
            elevation: 1,
            sx: {
              mt: 1,
              borderRadius: 2,
              minWidth: 150,
            },
          }}
        >
          <MenuItem
            onClick={() => {
              handleClose()
              setOpen(true)
            }}
          >
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Modifier" />
          </MenuItem>

          <MenuItem
            onClick={(e) => {
              e.preventDefault();
              if (confirm("Souhaitez-vous retirer cette publication ?")) {
                deleteGroup(GroupId)
              }
            }}
          >
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Supprimer" />
          </MenuItem>
          <MenuItem onClick={(e) => {
            e.preventDefault()
            leaveGroup(GroupId, user.id)
          }}>
            <ListItemIcon>
              <ExitToApp fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Quitter" />
          </MenuItem>
        </Menu>
      </>

      {open && (
        <GroupEdit
          open={open}
          onClose={onClose}
          GroupId={GroupId}
        >
          {" "}
        </GroupEdit>
      )}
    </div>
  );
}
