import { useContext, useEffect, useState } from "react";
import EditComment from "./EditComment";
import { AppContext } from "../../../context/AppContext";
import api from "../../../components/axios";
import { Avatar } from "@mui/material";

export default function CommentBox({ comment, Postid, fetchComments, setSelectedComment }) {
  const [image, setImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [isHovered, setIsHovered] = useState(false)

  const { user } = useContext(AppContext);

  useEffect(() => {
    const userDetail = comment?.user?.user_detail;
    if (userDetail && userDetail.image) {
      setImage(userDetail.image);
    } else {
      setImage(null);
    }
  }, [comment]);

  const handleDelete = (CommentId) => {
    if (confirm("Voulez-vous vraiment supprimer ce commentaires?")) {
      api
        .delete(`/comments/${CommentId}/delete`)
        .then(() => {
          fetchComments(Postid)
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }; 

  const colorName = comment.user.last_name + " " + comment.user.first_name || ''

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
    <div className="flex items-start mt-2 w-auto"
      onMouseOver={() => {
        setIsHovered(true)
      }}
      onMouseOut={() => {
        setIsHovered(false)
      }}
    >

      <div className="mr-2">
        <Avatar {...stringAvatar(colorName)} />
      </div>
      <div className="flex flex-col w-full">
        <div className="w-full bg-gray-50 rounded-lg p-2">
          <h1 className="font-semibold text-sm">{comment.user.last_name + " " + comment.user.first_name}</h1>
          <p className="text-justify text-md">{comment.content}</p>
        </div>

        {isHovered && user.id === comment.user_id && (
          <div className="gap-2">
            <button
              className="text-gray-500 hover:text-red-500 mx-2 text-sm cursor-pointer font-semibold "
              onClick={(e) => {
                e.preventDefault()
                handleDelete(comment.id)
              }}
            >
              Suppr.
            </button>
            <button
              className="text-gray-500 hover:text-gray-500 mx-2 md:text-sm cursor-pointer font-semibold"
              onClick={() => {
                setSelectedComment(comment.id)
              }}
            >
              Modif.
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <EditComment id={Postid} commentId={comment.id} setIsOpen={setIsOpen} fetchComments={fetchComments} />
      )}
    </div>
  );
}
