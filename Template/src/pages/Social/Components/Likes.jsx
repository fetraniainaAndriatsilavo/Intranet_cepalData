import { useContext, useEffect, useState } from "react";

import api from "../../../components/axios";
import { AppContext } from "../../../context/AppContext";

function LikeButton({ id, like }) {
  const { token, user } = useContext(AppContext);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(like || 0);

  // const [likesCount, setLikesCount] = useState(likes || 0) 

  useEffect(() => {
    api
      .get(`/react/${id}/getReactionCount`)
      .then((response) => {
        const reactions = response.data;
        const userHasReacted = reactions.some(r => r.user_id === user.id);
        setLiked(userHasReacted);
        setLikes(reactions.length);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, user]);


  const toggleLike = () => {
    const isLike = !liked;
    const type = isLike ? "like" : "dislike";

    api.post(
      `/react/${id}`,
      {
        user_id: user.id,
        type,
      },
      {
        headers: {
          // Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    )
      .then((response) => {
        console.log(response);
        setLiked(isLike);
        setLikes((prev) => prev + (isLike ? 1 : -1));
      })
      .catch((error) => {
        console.error(error);
      });
  };


  return (
    <button
      className="mr-2 p-2 rounded-full hover:bg-gray-200 transition items-center justify-center flex gap-1"
      onClick={toggleLike}
      aria-label="Like"
    >
      {
        liked == true ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-red-500 icon icon-tabler icons-tabler-filled icon-tabler-heart">
          <title> Likes </title>
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />
        </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-heart">
          <title> Likes </title>
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
        </svg>
      }
      <span className={`${liked ? "text-red-500 font-semibold" : ""}`}>
        {likes}
      </span>
    </button>
  );
}

export default LikeButton;
