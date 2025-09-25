import { Avatar, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

export default function GroupCard({
  data,
  setSelectedGroupChat,
  setSelectedConversation,
  setSelectedNewConversation,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // --- Avatar helpers ---
  function stringToColor(string) {
    let hash = 0;
    for (let i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  function stringAvatar(name) {
    const initials = name
      ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
      : "?";
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 40,
        height: 40,
        fontSize: "0.9rem",
      },
      children: initials.toUpperCase(),
    };
  }

  const colorName = data.name || "";

  return (
    <div
      className={`flex items-center justify-between gap-2 p-2 cursor-pointer transition rounded-lg mt-1.5 overflow-hidden w-full`}
      onClick={() => {
        setSelectedGroupChat(data.id);
        setSelectedConversation(null);
        setSelectedNewConversation(null);
      }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar {...stringAvatar(colorName)} />
      </div> 
      
      {/* Contenu */}
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-gray-900 text-sm truncate">
            {data.name}
          </h1>
          {data.last_message?.created_at && (
            <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
              {new Date(data.last_message.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        <span className="text-xs text-gray-500 truncate">
          {data.last_message ? data.last_message.content : "Démarrez une conversation"}
        </span>
      </div>
    </div>
  );
}
