import { Avatar, Menu, MenuItem } from "@mui/material";
import { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import api from "../../axios"; // make sure to import your api instance

export default function UserCard({
    data,
    type,
    setSelectedConversation,
    setSelectedGroupChat,
    setSelectedNewConversation,
    setSearchUser,
    fetchConversation,
}) {
    const { user } = useContext(AppContext);
    const [isHovered, setIsHovered] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // --- Avatar helpers ---
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

    // --- Helpers ---
    function returnColorName(type, data, id) {
        if (type === "search") return data.first_name;
        return id === data.user_one_id
            ? data.user_two.first_name
            : data.user_one.first_name;
    }

    const colorName = returnColorName(type, data, user.id);

    const deleteConversation = (id, userId) => {
        api
            .delete(`/conversations/${id}/delete`)
            .then(() => fetchConversation(userId))
            .catch((error) => console.log(error));
    };

    // --- Menu handlers ---
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <div
            className={`flex items-center p-2 cursor-pointer transition rounded-lg mt-1.5 overflow-hidden w-full gap-2 ${isHovered ? "bg-gray-100" : ""
                }`}
            onClick={() => {
                if (type === "conversation") {
                    setSelectedConversation(data.id);
                    setSelectedNewConversation(null);
                    setSelectedGroupChat(null);
                } else {
                    setSelectedNewConversation(data.id);
                    setSelectedConversation(null);
                    setSelectedGroupChat(null);
                    setSearchUser("");
                }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Avatar */}
            <div className="flex-shrink-0">
                <Avatar {...stringAvatar(colorName)} />
            </div>

            {/* Main content */}
            <div className="flex flex-col min-w-0 flex-1">
                <div className="flex justify-between items-center">
                    <h1 className="font-semibold text-gray-900 text-sm truncate">
                        {
                            type === "search"
                                ? data.last_name + ' ' + data.first_name
                                : user.id === data.user_one_id
                                    ? data.user_two.last_name + ' ' + data.user_two.first_name
                                    : data.user_one.last_name + ' ' + data.user_one.first_name
                        }
                    </h1>
                    {type === "conversation" && data.last_message?.created_at && (
                        <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                            {new Date(data.last_message.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    )}
                </div>

                {type === "conversation" && (
                    <span className="text-xs text-gray-500 truncate">
                        {data.last_message?.content
                            ? (user.id === data.last_message.sender_id
                                ? `Vous: ${data.last_message.content}`
                                : data.last_message.content)
                            : (user.id === data.last_message.sender_id
                                ? "Vous avez envoyé un fichier"
                                : "a envoyé un fichier")}
                    </span>
                )}


                {type === "search" && (
                    <span className="text-xs text-gray-500 truncate">
                        Démarrez une nouvelle conversation
                    </span>
                )}
            </div>

            {/* Hover menu */}
            {/* {isHovered && type === "conversation" && (
                <button
                    className="cursor-pointer p-1 hover:bg-gray-200 rounded-full"
                    onClick={(e) => {
                        e.stopPropagation(); // prevent selecting chat
                        handleClick(e);
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-600"
                    >
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="19" r="1" />
                    </svg>
                </button>
            )} */}

            {/* <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <MenuItem
                    onClick={(e) => {
                        e.preventDefault();
                        if (confirm("Voulez-vous vraiment supprimer cette conversation?")) {
                            deleteConversation(data.id, user.id);
                        }
                    }}
                >
                    Supprimer
                </MenuItem>
            </Menu> */}
        </div>
    );
}
