import { Avatar } from "@mui/material";
import { useState } from "react";

export default function GroupCard({ data, setSelectedGroupChat, setSelectedConversation, setSelectedNewConversation }) {

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

    const colorName = data.name || ''

    return <div className="flex items-center p-2 cursor-pointer transition rounded-lg  mt-1.5 overflow-hidden w-full" onClick={() => {
        setSelectedGroupChat(data.id)
        setSelectedConversation(null)
        setSelectedNewConversation(null)
    }}>
        <div className="w-12 h-12 overflow-hidden mr-4 flex-shrink-0">
            <Avatar {...stringAvatar(colorName)} />
            {/* <Avatar> {data.name} </Avatar>  */}
        </div>
        <div className="flex flex-col min-w-0">
            <h1 className="font-semibold text-gray-900 text-base">
                {data.name}
            </h1>
            <span className="text-sm text-gray-500 truncate whitespace-nowrap overflow-hidden">
                Démarrez une conversation
            </span>
        </div>
    </div>
}