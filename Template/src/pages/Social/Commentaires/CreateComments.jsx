import { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import api from "../../../components/axios";
function CreateComments({ id }) {
  const { user } = useContext(AppContext);
  const [content, setContent] = useState("");

  const PublishComment = (e) => {
    e.preventDefault();
    api
      .post(
        "/posts/" + id + "/comment",
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
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="items-start justify-between flex flex-wrap gap-2 bg-white p-2 border-b-1">
      <div>
        <img
          src={
            image
              ? "https://youduwk.cluster029.hosting.ovh.net/profile_images/" +
                image
              : IconBoy
          }
          alt="profile"
          className="rounded-full w-10 h-10"
        />
      </div>

      <div className="flex-1 min-w-[200px]">
        <textarea
          name="content"
          id="content"
          className="w-full bg-gray-50 rounded-lg text-gray-700 p-2 resize-none h-10"
          placeholder="Écrivez votre commentaire"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        ></textarea>
      </div>

      <div>
        <button
          className="text-white px-4 py-2 cursor-pointer rounded-lg"
          onClick={PublishComment}
        >
          <img src={PaperPlane} alt="send_comment" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default CreateComments;
