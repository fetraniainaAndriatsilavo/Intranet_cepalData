import { Avatar } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../../../context/AppContext";

export default function UserCard({ data, type, setSelectedConversation, setSelectedGroupChat }) {
    const { user } = useContext(AppContext)
    return <div className="flex items-center p-2 cursor-pointer transition rounded-lg  mt-1.5 overflow-hidden w-full" onClick={() => {
        if (type == 'conversation') {
            alert('Comversation récente:' + data.id)
            setSelectedConversation(data.id)
            setSelectedGroupChat(null)
        } else {
            alert('nouvelle conversation :' + data.id)
            setSelectedConversation(data.id)
            setSelectedGroupChat(null)
        }
    }}>
        <div className="w-12 h-12 overflow-hidden mr-4 flex-shrink-0">
            <Avatar> {'Utilisateur'.charAt(0).toUpperCase()} </Avatar>
        </div>
        <div className="flex flex-col min-w-0 ">
            {
                type == 'search' && <h1 className="font-semibold text-gray-900 text-base flex flex-row items-center gap-2">
                    {data.first_name}
                </h1>
            }
            {
                type == 'conversation' && <h1 className="font-semibold text-gray-900 text-base">
                    {user.id == data.user_one_id ? data.user_two.first_name : data.user_one.first_name}
                </h1>
            }

            {
                type == 'conversation' &&
                <span className="text-sm text-gray-500 truncate whitespace-nowrap overflow-hidden">
                    Salut, bienvenue dans Cepal Chat
                </span>
            }

            {
                type == 'search' && <span className="text-sm text-gray-500 truncate whitespace-nowrap overflow-hidden">
                    {data.role}
                </span>
            }
        </div>
    </div>
}