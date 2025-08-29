import { Avatar } from "@mui/material";
import { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import api from "../../axios";

export default function NewMessageBox({ msg }) {
    const { user } = useContext(AppContext)
    const deleted = false;
    const [isShown, setIsShown] = useState(false)


    const deleteMessage = (id) => {
        api
            .delete('/messages/' + id + '/delete', {
                data: { status: 'inactive' },
            })
            .then((response) => {
                console.log(response.data.message);
            })
            .catch((error) => {
                console.log(error.response?.data?.message || error.message);
            });
    };

    return (
        <div
            key={msg.id}
            className={`flex ${msg.sender.id == user.id ? "justify-end" : "justify-start gap-2"
                }`}

        >
            {msg.sender.id !== user.id && (
                <Avatar
                    sx={{
                        width: 24,
                        height: 24,
                        padding: "10px",
                    }}
                >
                    {msg.sender.last_name.charAt(0).toUpperCase()}
                </Avatar>
            )}

            {/* Wrap message + actions in a column */}
            <div className="flex flex-col items-start" onMouseOver={() => {
                setIsShown(true)
            }}
                onMouseOut={() => {
                    setIsShown(false)
                }}
            >
                <div
                    className={`p-3 max-w-md ${msg.sender.id == user.id
                        ? "bg-sky-700 text-white rounded-b-xl rounded-l-xl"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-r-xl rounded-b-xl"
                        }`}
                // onClick={() => {
                //     alert(msg.id);
                // }}
                >
                    <p>{msg.content}</p>
                    <span className="block text-xs mt-1 opacity-70">{msg.time}</span>
                </div>

                {/* Buttons below the message */}
                {isShown && deleted == false && msg.sender.id == user.id && (
                    <div className="flex flex-row gap-2 mt-1 text-xs">
                        <span
                            onClick={(e) => {
                                if (confirm("Voulez-vous vraiment supprimer ce message ?")) {
                                    deleteMessage(msg.id)
                                }
                            }}
                            className="cursor-pointer text-red-500"
                        >
                            Suppr.
                        </span>
                        <span
                            onClick={(e) => {
                                e.preventDefault();
                                setMessageId(msg.message_id)
                            }}
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
