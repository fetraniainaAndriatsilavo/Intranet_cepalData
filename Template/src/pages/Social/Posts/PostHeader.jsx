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

  return (
    <div className="bg-white mt-3 flex items-center justify-between rounded-t-lg p-1 relative">
      <div className="p-2 flex flex-row items-center justify-center gap-3">
        <div>
          <Avatar> {username.slice(0, 2).toUpperCase()} </Avatar>
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
              e.preventDefault();
              setIsOpen(!isOpen);
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

          {isOpen && (
            <div className="absolute right-10 top-5">
              <PostOption id={id} fetchPost={fetchPost} onClose={() => {
                setIsOpen(false)
              }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PostHeader;
