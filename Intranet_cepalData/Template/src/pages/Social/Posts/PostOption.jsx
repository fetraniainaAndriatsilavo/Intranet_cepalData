import axios from "axios";
import { useState } from "react";
import PostEdit from "./PostEdit"
import api from "../../../components/axios";

function PostOption({ id, fetchPost, onClose }) {
  const [isOpen, setIsOpen] = useState(false);

  const DeletePost = (e) => {
    e.preventDefault();
    api
      .delete(
        "/posts/" + id + "/delete",
        { data : { status: "published" }, headers: { "Content-Type": "application/json" } }
      )
      .then(() => { 
        onClose() 
        fetchPost() 
      })
      .catch((error) => { 
      });
  };

  const toggleEditPost = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="absolute mt-2 w-35 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <ul className="py-2 text-gray-800">
        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
          <button onClick={toggleEditPost}>Modifier</button>
        </li>
        <li className="px-4 py-2 hover:bg-gray-100 hover:text-red-500 cursor-pointer flex items-center gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              if (confirm("Souhaitez-vous retirer cette publication ?")) {
                DeletePost(e);
              }
            }}
          >
            Supprimer
          </button>
        </li>
      </ul>

      {isOpen && <PostEdit PostID={id} setIsOpen={setIsOpen} fetchPost={fetchPost} />}
    </div>
  );
}

export default PostOption;
