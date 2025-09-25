import { useContext, useState } from "react";
import PostOption from "./PostOption";
import { AppContext } from "../../../context/AppContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
import { Avatar } from "@mui/material";

dayjs.extend(relativeTime);
dayjs.locale("fr");

function PostHeader({ username, id, userID, created_at, fetchPost }) {
  const { user } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);

  const colorName = username || ''

  const [anchorEl, setAnchorEl] = useState(null); 

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // save the button element
  };

  const handleClose = () => {
    setAnchorEl(null);
  }; 

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

  return (
    <div className="bg-white mt-3 flex items-center justify-between rounded-t-lg p-1 relative">
      <div className="p-2 flex flex-row items-center justify-center gap-3">
        <div>
          <Avatar {...stringAvatar(colorName)} />
        </div>
        <div>
          <p>
            <span className="font-semibold text-sky-600 hover:cursor-pointer hover:underline">@{username}</span>
          </p>
          <span className="text-gray-300 text-sm">
            {dayjs(created_at).fromNow()}
          </span>
        </div>
      </div>

      {/* More button with relative wrapper */}
      {(userID === user.id || user.role == 'admin') && (
        <div className="mr-3 relative  hover:bg-gray-50 hover:rounded-lg flex items-center hover:p-1">
          <button
            className="cursor-pointer"
            onClick={(e) => {
               handleClick(e)
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-dots"
            >
              <title> Menu </title>
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
            </svg>
          </button>
              <PostOption id={id} fetchPost={fetchPost} anchorEl={anchorEl} onClose={() => {
                handleClose()
              }} /> 
        </div>
      )}
    </div>
  );
}

export default PostHeader;
