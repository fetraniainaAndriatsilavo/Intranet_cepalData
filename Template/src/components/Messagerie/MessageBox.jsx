import { Avatar } from "@mui/material";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import api from "../axios";

export default function MessageBox({ msg, setMessageId, showTime }) {
    const { user } = useContext(AppContext);
    const [isShown, setIsShown] = useState(false);

    const colorName = msg.sender.first_name;

    function stringToColor(string) {
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = "#";
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        return color;
    }

    function stringAvatar(name) {
        return {
            sx: {
                width: 32,
                height: 32,
                fontSize: 14,
                bgcolor: stringToColor(name),
            },
            children: `${name.split(" ")[0][0]}`,
        };
    }

    function formatHour(d) {
        const date = new Date(d);
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    }

    const deleteMessage = (id) => {
        api
            .put("/messages/" + id + "/update", {
                data: {
                    status: "inactive",
                    content: "Message Indisponible",
                },
            })
            .then((response) => {
                console.log(response.data.message);
            })
            .catch((error) => {
                console.log(error.response?.data?.message || error.message);
            });
    };

    const isMine = msg.sender.id === user.id;
    const isInactive = msg.status === "inactive";

    return (
        <div
            className={`flex mb-3 ${isMine ? "justify-end" : "justify-start"} gap-2`}
            onMouseEnter={() => setIsShown(true)}
            onMouseLeave={() => setIsShown(false)}
        >
            {/* Avatar on left for received messages */}
            {!isMine && <Avatar {...stringAvatar(colorName)} />}

            {/* Message bubble + attachments + actions */}
            <div className="flex flex-col max-w-xs sm:max-w-md">
                {/* Bubble */}
                {
                    msg.content && <div
                        className={`p-3 relative ${isInactive
                            ? "bg-gray-100 italic text-gray-500 rounded-xl"
                            : isMine
                                ? "bg-sky-600 text-white rounded-l-xl rounded-b-xl"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-r-xl rounded-b-xl"
                            }`}
                    >
                        <p className="whitespace-pre-wrap break-words"> {isInactive ? 'Message Indisponible' : msg.content}</p>
                        {showTime && !isInactive && (
                            <span className="text-[10px] opacity-70">
                                {formatHour(msg.created_at)}
                            </span>
                            // absolute bottom-1 right-2
                        )}
                    </div>
                }

                {/* Attachments grid */}
                {msg.files && msg.files.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-1 bg-black">
                        {msg.files.map((file, idx) => (
                            <img
                                key={idx}
                                src={file.url}
                                alt={file.name}
                                className="w-28 h-28 object-cover rounded-lg"
                            />
                        ))}

                    </div>
                )}
                {/* Hover actions */}
                {isShown && !isInactive && isMine && (
                    <div className="flex gap-3 mt-1 text-xs text-gray-500">
                        <span
                            onClick={() => {
                                if (confirm("Voulez-vous vraiment supprimer ce message ?")) {
                                    deleteMessage(msg.id);
                                }
                            }}
                            className="cursor-pointer hover:text-red-500"
                        >
                            Suppr.
                        </span>
                        <span
                            onClick={() => setMessageId(msg.id)}
                            className="cursor-pointer hover:text-sky-600"
                        >
                            Modif.
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
