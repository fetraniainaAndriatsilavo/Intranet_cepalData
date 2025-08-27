import { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import api from "../../../components/axios";
import { Avatar } from "@mui/material";
function CreateComments({ id, fetchComments }) {
  const { user } = useContext(AppContext);
  const [content, setContent] = useState("");

  const PublishComment = (PostId) => {
    api
      .post(
        "/posts/" + PostId + "/comments",
        {
          content: content,
          user_id: user.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        setContent("");
        fetchComments(PostId)
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="items-start justify-between flex flex-wrap gap-2 bg-white p-2 border-b-1">
      <div>
        <Avatar> {user.first_name.charAt(0) + '' + user.last_name.charAt(0)} </Avatar>
      </div>

      <div className="flex-1 min-w-[200px]">
        <textarea
          name="content"
          id="content"
          className="w-full bg-gray-100 rounded-lg text-gray-700 p-2 resize-none h-10 border border-none"
          placeholder="Écrivez votre commentaire"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        ></textarea>
      </div>

      <div>
        <button
          className="text-white px-4 py-2 cursor-pointer rounded-lg bg-sky-700"
          onClick={(e) => {
            e.preventDefault()
            PublishComment(id)
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-send"><path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 14l11 -11" />
            <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CreateComments;
