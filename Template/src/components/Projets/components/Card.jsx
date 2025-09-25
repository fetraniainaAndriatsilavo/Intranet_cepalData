import { Delete, Edit } from "@mui/icons-material";
import { Avatar, AvatarGroup, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { useContext, useState } from "react";
import api from "../../axios";
import { AppContext } from "../../../context/AppContext";

export default function Card({ data, onDragStart, ViewCard, fetchTaskProject, projectId }) {
    const { user } = useContext(AppContext)
    const cardStyle = {
        padding: "0.75rem",
        marginBottom: "0.5rem",
        borderRadius: "6px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    };

    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const deleteTask = (id) => {
        api.delete('/taches/' + id + '/delete')
            .then(() => {
                fetchTaskProject(projectId)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    function stringToColor(string) {
        let hash = 0;
        for (let i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = "#";
        for (let i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        return color;
    }

    function stringAvatar(name) {
        const initials = name
            ? name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
            : "?";
        return {
            sx: {
                bgcolor: stringToColor(name),
                width: 40,
                height: 40,
                fontSize: "0.9rem",
            },
            children: initials.toUpperCase(),
        };
    }

    const colorName = data.assigned_user.last_name + ' ' + data.assigned_user.first_name
    return (
        <div
            style={cardStyle}
            className="bg-[#fff] hover:cursor-pointer hover:bg-gray-50 w-[300px]"
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData("taskId", data.id);
                onDragStart(e, data)
            }}
        // onClick={ViewCard}
        >
            <div className="flex items-center justify-between">
                <strong> {data.title} </strong>
                {
                    (user.role != 'user') && <button onClick={handleClick} className="cursor-pointer"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-dots">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                        <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                        <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                    </svg>
                    </button>
                }

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    PaperProps={{
                        elevation: 1,
                        sx: {
                            mt: 1,
                            borderRadius: 2,
                            minWidth: 150,
                        },
                    }}>
                    <MenuItem onClick={() => {
                        handleClose()
                        ViewCard()
                    }}>
                        <ListItemIcon>
                            <Edit fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Modifier" />
                    </MenuItem>
                    <MenuItem onClick={() => {
                        deleteTask(data.id)
                    }}>
                        <ListItemIcon>
                            <Delete fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Supprimer" />
                    </MenuItem>
                </Menu>
            </div>
            <p className="leading-5 text-sm"> {data.description} </p>
            <div className="flex items-center justify-between flex-row mt-3">
                <AvatarGroup max={3} spacing={"small"}>
                    <Avatar {...stringAvatar(colorName)} />
                </AvatarGroup>
                <span className=" p-0.5 rounded-lg">
                    {
                        data.type == 'Bug' ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-pink-300 icon icon-tabler icons-tabler-filled icon-tabler-bug" aria-label={data.type}>
                            <title> Bug </title>
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 4a4 4 0 0 1 3.995 3.8l.005 .2a1 1 0 0 1 .428 .096l3.033 -1.938a1 1 0 1 1 1.078 1.684l-3.015 1.931a7.17 7.17 0 0 1 .476 2.227h3a1 1 0 0 1 0 2h-3v1a6.01 6.01 0 0 1 -.195 1.525l2.708 1.616a1 1 0 1 1 -1.026 1.718l-2.514 -1.501a6.002 6.002 0 0 1 -3.973 2.56v-5.918a1 1 0 0 0 -2 0v5.917a6.002 6.002 0 0 1 -3.973 -2.56l-2.514 1.503a1 1 0 1 1 -1.026 -1.718l2.708 -1.616a6.01 6.01 0 0 1 -.195 -1.526v-1h-3a1 1 0 0 1 0 -2h3.001v-.055a7 7 0 0 1 .474 -2.173l-3.014 -1.93a1 1 0 1 1 1.078 -1.684l3.032 1.939l.024 -.012l.068 -.027l.019 -.005l.016 -.006l.032 -.008l.04 -.013l.034 -.007l.034 -.004l.045 -.008l.015 -.001l.015 -.002l.087 -.004a4 4 0 0 1 4 -4zm0 2a2 2 0 0 0 -2 2h4a2 2 0 0 0 -2 -2z" />
                        </svg> : data.type == 'Task' ? <svg aria-label={data.type} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-sky-600 icon icon-tabler icons-tabler-filled icon-tabler-clipboard">
                            <title> Tâche </title>
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M17.997 4.17a3 3 0 0 1 2.003 2.83v12a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 2.003 -2.83a4 4 0 0 0 3.997 3.83h4a4 4 0 0 0 3.98 -3.597zm-3.997 -2.17a2 2 0 1 1 0 4h-4a2 2 0 1 1 0 -4z" />
                        </svg> : data.type == 'Story' ? <svg aria-label={data.type} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-200 icon icon-tabler icons-tabler-filled icon-tabler-book">
                            <title> User Story</title>
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M21.5 5.134a1 1 0 0 1 .493 .748l.007 .118v13a1 1 0 0 1 -1.5 .866a8 8 0 0 0 -7.5 -.266v-15.174a10 10 0 0 1 8.5 .708m-10.5 -.707l.001 15.174a8 8 0 0 0 -7.234 .117l-.327 .18l-.103 .044l-.049 .016l-.11 .026l-.061 .01l-.117 .006h-.042l-.11 -.012l-.077 -.014l-.108 -.032l-.126 -.056l-.095 -.056l-.089 -.067l-.06 -.056l-.073 -.082l-.064 -.089l-.022 -.036l-.032 -.06l-.044 -.103l-.016 -.049l-.026 -.11l-.01 -.061l-.004 -.049l-.002 -13.068a1 1 0 0 1 .5 -.866a10 10 0 0 1 8.5 -.707" />
                        </svg> : < svg aria-label={data.type} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-green-500 icon icon-tabler icons-tabler-outline icon-tabler-file-isr">
                            <title> Sous-tâche </title>
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M15 3v4a1 1 0 0 0 1 1h4" />
                            <path d="M15 3v4a1 1 0 0 0 1 1h4" />
                            <path d="M6 8v-3a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7" />
                            <path d="M3 15l3 -3l3 3" />
                        </svg>
                    }
                </span>
            </div>
        </div>
    );
}
