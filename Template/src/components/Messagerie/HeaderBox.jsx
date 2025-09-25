import { useContext, useState } from "react"
import { AppContext } from "../../context/AppContext"
import { Avatar, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material"
import api from "../axios";
import { Link } from "react-router-dom";
import { Delete } from "@mui/icons-material";

export default function HeaderBox({ conversation, fetchConversationList }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    }; 
    const { user } = useContext(AppContext)

    const UserProfil = !conversation.user_one
        ? ""
        : conversation.user_one.id === user.id
            ? conversation.user_two.id
            : conversation.user_one.id

    const initials = !conversation.user_one
        ? ""
        : conversation.user_one.id === user.id
            ? conversation.user_two.last_name.charAt(0).toUpperCase() + conversation.user_two.first_name.charAt(0).toUpperCase()
            : conversation.user_one.last_name.charAt(0).toUpperCase() + conversation.user_one.first_name.charAt(0).toUpperCase()

    const fullName = !conversation.user_one
        ? ""
        : conversation.user_one.id === user.id
            ? conversation.user_two.last_name + " " + conversation.user_two.first_name
            : conversation.user_one.last_name + " " + conversation.user_one.first_name


    const colorName = !conversation.user_one
        ? ""
        : conversation.user_one.id === user.id
            ? conversation.user_two.first_name
            : conversation.user_one.first_name

    function stringToColor(string) {
        let hash = 0;
        let i;
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        return color;
    }

    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}`,
        };
    }


    // suppression de la conversation 
    const deleteConversation = (id, userId) => {
        api.delete('/conversations/' + id + '/delete')
            .then(() => {
                fetchConversationList(userId)
                window.location.reload()
            })
            .catch((error) => {
                console.log(error)
            })
    }


    return <div className="border-b p-4 flex items-center gap-2 flex-row bg-white dark:bg-gray-800 justify-between">
        <div className="flex flex-row gap-2 items-center">
            <Avatar {...stringAvatar(colorName)} />
            <Link to={'/profil-utilisateur/' + UserProfil}>
                <h2 className="font-bold text-lg hover:underline hover:cursor-pointer"> {fullName} </h2>
            </Link>
        </div>
        <div>
            <button className="cursor-pointer hover:p-2 hover:bg-gray-100 rounded-full" onClick={handleClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-dots">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                    <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                    <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                </svg>
            </button>
        </div>
        <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <MenuItem onClick={(e) => {
                e.preventDefault()
                alert(conversation.id)
                deleteConversation(conversation.id, user.id)
            }}>
                <ListItemIcon>
                    <Delete fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Supprimer" />
            </MenuItem>
        </Menu>
    </div>
}