import { Menu, MenuItem } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import api from "../../axios";

export default function GroupOption({ anchorEl, onClose, group, setOpenEdit }) {
    const open = Boolean(anchorEl);
    const { user } = useContext(AppContext)

    const deleteGroup = (id) => {
        api.delete('/messages/' + id + '/delete')
            .then(() => {
                window.location.reload()
            })
    }

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
            // anchorOrigin={{
            //     vertical: "top", // show below the button
            //     horizontal: "right", // align with button right edge
            // }}
            // transformOrigin={{
            //     vertical: "top", // menu grows downward
            //     horizontal: "right",
            // }}
            PaperProps={{
                elevation: 1,
                sx: {
                    mt: 1, // small gap between button and menu
                    borderRadius: 2,
                    minWidth: 150,
                },
            }}
        >
            {
                user.id == group.updated_by && <MenuItem nClick={(e) => {
                    e.preventDefault9
                    deleteGroup(group.id)
                }}> Supprimer. </MenuItem>
            }
            <MenuItem onClick={(e) => {
                e.preventDefault9
                leaveGroup(group.id, user.id)
            }}> Quitter.</MenuItem>
            <MenuItem onClick={() => {
                setOpenEdit(true)
            }}> Modif. </MenuItem>
        </Menu>
    );
}
