import { Avatar } from "@mui/material";

export default function GroupCard({ data, setSelectedGroupChat, setSelectedConversation }) {
    return <div className="flex items-center p-2 cursor-pointer transition rounded-lg  mt-1.5 overflow-hidden w-full" onClick={() => {
        alert(data.id)
        setSelectedGroupChat(data.id)
        setSelectedConversation(null)
    }}>
        <div className="w-12 h-12 overflow-hidden mr-4 flex-shrink-0">
            <Avatar> {data.name.charAt(0).toUpperCase()} </Avatar>
        </div>
        <div className="flex flex-col min-w-0">
            <h1 className="font-semibold text-gray-900 text-base">
                {data.name}
            </h1>
            <span className="text-sm text-gray-500 truncate whitespace-nowrap overflow-hidden">
                Salut, bienvenue dans Cepal Chat Group
            </span>
        </div>
    </div>
}