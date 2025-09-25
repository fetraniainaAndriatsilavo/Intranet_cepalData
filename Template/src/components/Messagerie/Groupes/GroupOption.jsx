import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import api from "../../axios";
import { Delete, Edit, ExitToApp } from "@mui/icons-material";

export default function GroupOption({ anchorEl, onClose, group, setOpenEdit }) {
    const open = Boolean(anchorEl);
    const { user } = useContext(AppContext)

    //variable o=pour savoir si on est admin ou non 
    const isAdmin = group.members.some(
        (member) => member.id === user.id && member.pivot.is_admin === true
    );

    //fonction pour supprimer de ce groupe
    const deleteGroup = (id) => {
        api.delete('/messages/' + id + '/delete')
            .then(() => {
                window.location.reload()
            })
    }


    //fonction pour se quitter du groupe
    const leaveGroup = (id, userId) => {
        api.post('/message-groups/' + id + '/leave',
            {
                user_id: userId
            }, {
            headers: {
                "Content-Type": 'application/json'
            }
        }
        )
            .then(() => {
                window.location.reload()
            })
    }

    return (
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
            <MenuItem onClick={() => {
                setOpenEdit(true)
            }}>
                <ListItemIcon>
                    <Edit fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Modifier" />
            </MenuItem>
            {
                isAdmin == true && <MenuItem onClick={(e) => {
                    e.preventDefault9
                    deleteGroup(group.id)
                }}>
                    <ListItemIcon>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Supprimer" />
                </MenuItem>
            }
            <MenuItem onClick={(e) => {
                e.preventDefault()
                leaveGroup(group.id, user.id)
            }}>
                <ListItemIcon>
                    <ExitToApp fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Quitter" />
            </MenuItem>
        </Menu>
    );
}
