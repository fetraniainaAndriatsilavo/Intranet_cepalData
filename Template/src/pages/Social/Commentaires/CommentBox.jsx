import { useContext, useEffect, useState } from "react";
import EditComment from "./EditComment";
import { AppContext } from "../../../context/AppContext";
import api from "../../../components/axios";
import { Avatar } from "@mui/material";

export default function CommentBox({ comment, Postid, fetchComments }) {
  const [image, setImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className="flex items-start mt-2 w-auto">
      <div className="mr-2">
        <Avatar sx={{ width: 32, height: 32 }} className="text-sm"> {comment.user.first_name.charAt(0) + "" + comment.user.last_name.charAt(0)} </Avatar>
      </div>
      <div className="flex flex-col w-full">
        <div className="w-full bg-gray-50 rounded-lg p-3">
          <h1 className="font-semibold">{'@' + comment.user.first_name + " " + comment.user.last_name}</h1>
          <p className="text-justify">{comment.content}</p>
        </div>

        {user.id === comment.user_id && (
          <div className="gap-2">
            <button
              className="text-gray-500 hover:text-red-500 mx-2 md:text-sm cursor-pointer font-semibold"
              onClick={(e) => { 
                e.preventDefault()
                handleDelete(comment.id)
              }}
            >
              Suppr.
            </button>
            <button
              className="text-gray-500 hover:text-gray-500 mx-2 md:text-sm cursor-pointer font-semibold"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              Modif.
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <EditComment id={Postid} commentId={comment.id} setIsOpen={setIsOpen} fetchComments={fetchComments}/>
      )}
    </div>
  );
}
