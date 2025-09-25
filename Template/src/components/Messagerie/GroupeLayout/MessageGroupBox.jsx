import { Avatar } from "@mui/material";
import { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import api from "../../axios"; // 👈 make sure the import path is correct

export default function MessageGroupBox({ msg, setMessageId, showTime }) {
    const { user } = useContext(AppContext);
    const [isShown, setIsShown] = useState(false);

    const isMine = msg.sender_id === user.id;
    const isInactive = msg.status === 'inactive'
    const colorName = msg.sender_name

    const deleteMessage = async (id) => {
        try {
            const response = await api.delete(`/messages/${id}/delete`, {
                data: { status: "inactive" },
            });
            console.log(response.data.message);
        } catch (error) {
            console.error(error.response?.data?.message || error.message);
        }
    };

    const formatHour = (dateString) => {
        const date = new Date(dateString);
        return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    };


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

    return (
        <div
            key={msg.message_id}
            className={`flex ${isMine ? "justify-end" : "justify-start gap-2"}`}
        >
            {/* Avatar for other users */}
            {!isMine && msg.sender_name && (
                <Avatar {...stringAvatar(colorName)} sx={{ width: 24, height: 24, padding: "10px" }} />
            )}
            <div
                className="flex flex-col items-start"
                onMouseEnter={() => setIsShown(true)}
                onMouseLeave={() => setIsShown(false)}
            >
                {/* Message bubble */}
                <div
                    className={`p-3 max-w-md ${isInactive
                        ? "bg-gray-100 italic text-gray-500 rounded-xl"
                        : isMine
                            ? "bg-sky-600 text-white rounded-l-xl rounded-b-xl"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-r-xl rounded-b-xl"
                        }`}
                >
                    {!isMine && (
                        <h5 className="text-xs font-black">{msg.sender_name}</h5>
                    )}
                    <p> {isInactive ? 'Message Indisponible' : msg.content} </p>

                    {/* Time */}
                    {showTime && (
                        <span className="block text-xs mt-1 opacity-70">
                            {formatHour(msg.created_at)}
                        </span>
                    )}
                </div>

                {/* Attachments grid */}
                {msg.attachments && msg.attachments.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-1">
                        {msg.attachments.map((file, idx) => (
                            <img
                                key={idx}
                                src={file.url}
                                alt={file.name}
                                className="w-28 h-28 object-cover rounded-lg"
                            />
                        ))}
                    </div>
                )}

                {/* Actions (delete / edit) */}
                {isShown && isMine && (
                    <div className="flex flex-row gap-2 mt-1 text-xs">
                        <span
                            onClick={() => {
                                if (confirm("Voulez-vous vraiment supprimer ce message ?")) {
                                    deleteMessage(msg.message_id);
                                }
                            }}
                            className="cursor-pointer text-red-500"
                        >
                            Suppr.
                        </span>
                        <span
                            onClick={() => setMessageId(msg.message_id)}
                            className="cursor-pointer text-gray-500"
                        >
                            Modif.
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
