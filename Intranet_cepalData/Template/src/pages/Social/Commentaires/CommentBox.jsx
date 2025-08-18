import { useContext, useEffect, useState } from "react";
import EditComment from "./EditComment";
import { AppContext } from "../../../context/AppContext";
import api from "../../../components/axios";

export default function CommentBox({ comment, Postid }) {
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

  const handleDelete = () => {
    if (confirm("Voulez-vous vraiment supprimer ce commentaires?")) {
      api
        .delete(`/comments/${comment.id}/delete`)
        .then(() => {
          window.location.href = "/dashboard/social/actus/";
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div className="flex items-start mt-2 w-auto">
      <div className="mr-2">
        <img
          src={
            image
              ? `https://youduwk.cluster029.hosting.ovh.net/profile_images/${image}`
              : Boy
          }
          className="rounded-full w-12 h-12"
        />
      </div>
      <div className="flex flex-col w-full">
        <div className="w-full bg-gray-50 rounded-lg p-3">
          <h1 className="font-semibold">{comment.user.name}</h1>
          <p className="text-justify">{comment.content}</p>
        </div>

        {user.id === comment.user_id && (
          <div className="gap-2">
            <button
              className="text-gray-500 hover:text-red-500 mx-2 md:text-sm cursor-pointer font-semibold"
              onClick={handleDelete}
            >
              Supprimer
            </button>
            <button
              className="text-gray-500 hover:text-gray-500 mx-2 md:text-sm cursor-pointer font-semibold"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              Modifier
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <EditComment id={Postid} commentId={comment.id} setIsOpen={setIsOpen} />
      )}
    </div>
  );
}
