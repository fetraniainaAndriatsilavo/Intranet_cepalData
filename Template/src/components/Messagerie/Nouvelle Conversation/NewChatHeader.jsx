import { Avatar } from "@mui/material"
export default function NewChatHeader({ user }) {
    const colorName =  user.first_name || ''

    // const initials = user.last_name.charAt(0).toUpperCase() + user.first_name.charAt(0).toUpperCase()
    const fullName = user.last_name + ' ' + user.first_name

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

    return <div className="border-b p-4 flex items-center gap-2 flex-row bg-white dark:bg-gray-800">
        <Avatar {...stringAvatar(colorName)} />
        <h2 className="font-bold text-lg"> {fullName} </h2>
    </div>
}