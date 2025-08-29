import { Avatar } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../../../context/AppContext";

export default function UserCard({ data, type, setSelectedConversation, setSelectedGroupChat, setSelectedNewConversation, setSearchUser }) {
    const { user } = useContext(AppContext)

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

    function returnColorName(type, data, id) {
        if (type == 'search') {
            return data.first_name
        } else {
            if (id == data.user_one_id) {
                return data.user_two.first_name
            } else {
                return data.user_one.first_name
            }
        }
    }
    const colorName = returnColorName(type, data, user.id)

    return <div className="flex items-center p-2 cursor-pointer transition rounded-lg  mt-1.5 overflow-hidden w-full" onClick={() => {
        if (type == 'conversation') {
            setSelectedConversation(data.id)
            setSelectedNewConversation(null)
            setSelectedGroupChat(null)
        } else {
            setSelectedNewConversation(data.id)
            setSelectedConversation(null)
            setSelectedGroupChat(null)
            setSearchUser('')
        }
    }}>
        <div className="w-12 h-12 overflow-hidden mr-4 flex-shrink-0">
            <Avatar {...stringAvatar(colorName)} /> 
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
                    Démarrez une nouvelle conversation
                </span>
            }
        </div>
    </div>
}