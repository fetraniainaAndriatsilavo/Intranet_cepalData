import { useContext } from "react"
import { AppContext } from "../../context/AppContext"
import { Avatar } from "@mui/material"

export default function HeaderBox({ conversation }) {
    const { user } = useContext(AppContext)
    const initials = !conversation.user_one
        ? ""
        : conversation.user_one.id === user.id
            ? conversation.user_two.last_name.charAt(0).toUpperCase() + conversation.user_two.first_name.charAt(0).toUpperCase()
            : conversation.user_one.last_name.charAt(0).toUpperCase() + conversation.user_one.first_name.charAt(0).toUpperCase()

    const fullName = !conversation.user_one
        ? ""
        : conversation.user_one.id === user.id
            ? conversation.user_two.last_name + " " + conversation.user_two.first_name
            : conversation.user_one.last_name + " " + conversation.user_one.first_name


    return <div className="border-b p-4 flex items-center gap-2 flex-row bg-white dark:bg-gray-800">
        <Avatar>  {initials} </Avatar>
        <h2 className="font-bold text-lg"> {fullName} </h2>
    </div>
}