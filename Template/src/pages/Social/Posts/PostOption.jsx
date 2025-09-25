import { useState } from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import PostEdit from "./PostEdit";
import api from "../../../components/axios";

export default function PostOption({ anchorEl, onClose, id, fetchPost }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = Boolean(anchorEl);

  // supprimer le post
  const deletePost = (e) => {
    e.preventDefault();
    api
      .delete(`/posts/${id}/delete`, {
        data: { status: "published" },
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        onClose();
        fetchPost();
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du post :", error);
      });
  };

  const toggleEditPost = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
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
            toggleEditPost();
            onClose();
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
              deletePost(e);
            }
          }}
        >
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Supprimer" />
        </MenuItem>
      </Menu> 

      {isOpen && (
        <PostEdit PostID={id} setIsOpen={setIsOpen} fetchPost={fetchPost} />
      )}
    </>
  );
}
