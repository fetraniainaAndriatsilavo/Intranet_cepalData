import { Avatar } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

export default function MessageBox({ msg }) {
    const { user } = useContext(AppContext)
    return <div
        key={msg.id}
        className={`flex ${msg.sender.id == user.id ? "justify-end " : "justify-start gap-2"} `}
    >
        {
            msg.sender.id !== user.id && <Avatar sx={{
                width: 24,
                height: 24, padding: '10px'
            }}> {
                    msg.sender.last_name.charAt(0).toUpperCase()
                } </Avatar>
        }
        <div
            className={`p-3  max-w-md ${msg.sender.id == user.id
                ? "bg-sky-700 text-white rounded-b-xl rounded-l-xl"
                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-r-xl rounded-b-xl"
                }`}
            onClick={() => {
                alert(msg.id)
            }}
        >
            <p> {msg.content} </p>
            <span className="block text-xs mt-1 opacity-70">{msg.time}</span>
        </div>
    </div>
}
