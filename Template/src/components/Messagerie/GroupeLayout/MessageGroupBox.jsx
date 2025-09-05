import { Avatar } from "@mui/material";
import { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";

export default function MessageGroupBox({ msg, setMessageId, showTime }) {
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

    function formatHour(d) {
        const date = new Date(d)
        return date.getHours() + ":" + date.getMinutes()
    }

    return <div
        key={msg.message_id}
        className={`flex ${msg.sender_id == user.id ? "justify-end " : "justify-start gap-2"} `}
    >
        {
            user.id != msg.sender_id && msg.sender_name && <Avatar sx={{
                width: 24,
                height: 24, padding: '10px'
            }}> {
                    msg.sender_name.charAt(0).toUpperCase() || ""
                } </Avatar>
        }
        <div className="flex flex-col items-start" onMouseOver={() => {
            setIsShown(true)
        }}
            onMouseOut={() => {
                setIsShown(false)
            }}
        >
            <div
                className={`p-3  max-w-md ${msg.sender_id == user.id
                    ? "bg-sky-700 text-white rounded-b-xl rounded-l-xl"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-r-xl rounded-b-xl"
                    }`}
            >
                {
                    user.id != msg.sender_id && <h5 className="text-xs font-black"> @{msg.sender_name}</h5>
                }
                <p> {msg.content} </p>
                <span className="block text-xs mt-1 opacity-70">{showTime && formatHour(msg.created_at)}</span>
            </div>
            {isShown && deleted == false && msg.sender_id == user.id && (
                <div className="flex flex-row gap-2 mt-1 text-xs">
                    <span
                        onClick={(e) => {
                            if (confirm("Voulez-vous vraiment supprimer ce message ?")) {
                                deleteMessage(msg.message_id)
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
}
