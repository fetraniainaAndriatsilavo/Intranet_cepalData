import { Avatar } from "@mui/material";
import { useState } from "react";
import GroupOption from "../Groupes/GroupOption";

export default function GroupHeader({ groupId, group, setOpenEdit }) {


    const colorName = group.name || ''

    const [anchorEl, setAnchorEl] = useState(null);

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

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget); // save the button element
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return <div className="border-b p-4 flex items-center gap-2 justify-between bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2 ">
            <Avatar {...stringAvatar(colorName)} />
            <h2 className="font-bold text-lg">{group.name || 'Nom du Groupe '}  </h2>
        </div>
        <div>
            <button className="cursor-pointer hover:p-1 hover:bg-gray-100 rounded" onClick={handleClick}> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-dots">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>

            </button>
            <GroupOption anchorEl={anchorEl} onClose={handleClose} group={group} setOpenEdit={setOpenEdit} />
        </div>

    </div>
}