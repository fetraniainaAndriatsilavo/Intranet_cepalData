import { Avatar } from "@mui/material"
export default function NewChatHeader({ user }) {
    const initials = user.last_name.charAt(0).toUpperCase() + user.first_name.charAt(0).toUpperCase()
    const fullName = user.last_name + ' ' + user.first_name
    return <div className="border-b p-4 flex items-center gap-2 flex-row bg-white dark:bg-gray-800">
        <Avatar> {initials} </Avatar>
        <h2 className="font-bold text-lg"> {fullName} </h2>
    </div>
}