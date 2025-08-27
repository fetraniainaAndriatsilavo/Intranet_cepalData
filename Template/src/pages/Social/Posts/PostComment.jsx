import { useEffect, useState } from "react";
import CommentBox from "../Commentaires/CommentBox";
import CreateComments from "../Commentaires/CreateComments";
import Pusher from "pusher-js";
import api from "../../../components/axios";

function PostComment({ id, setCommentCount }) {
  const [comment, setComment] = useState(null);
  const [seeAll, setSeeAll] = useState(false)

  const fetchComments = (postId) => {
    api
      .get(`/comments/${postId}/all`)
      .then((response) => {
        setComment(response.data);
        setCommentCount(response.data.length)
      })
      .catch((error) => {
        console.log(error);
      });
  }


  useEffect(() => {
    fetchComments(id)
  }, [id]);

  // useEffect(() => {
  //   const pusher = new Pusher("9ccd80133c8d17a35fbe", {
  //     cluster: "eu",
  //     forceTLS: true,
  //   });

  //   const channel = pusher.subscribe(`post.${id}`);

  //   const handler = (newCommentEvent) => {
  //     console.log(newCommentEvent.content)
  //     setComment((prev) => [...prev, newCommentEvent]);
  //   };

  //   channel.bind("comment.sent", handler);

  //   return () => {
  //     channel.unbind("comment.posted", handler);
  //     channel.unsubscribe();
  //     pusher.disconnect();
  //   };
  // }, [id]);

  return (
    <div className="bg-white p-2 gap-2 flex-col rounded-b-lg transition-all duration-300">
      <CreateComments id={id} fetchComments={fetchComments}> </CreateComments>
      {
        comment && comment.length > 3 && <div className="mt-1 mb-2 flex items-center ">
          <span className="font-semibold cursor-pointer text-center text-md" onClick={(e) => {
            e.preventDefault()
            setSeeAll(!seeAll)
          }}> {comment && (seeAll ? 'Voir moins...' : 'Voir tous...')} </span>
        </div>
      }
      {comment && (
        seeAll
          ? comment.map((data, key) => (
            <CommentBox Postid={id} key={data.id || key} comment={data} fetchComments={fetchComments} />
          ))
          : comment.slice(-3).map((data, key) => (
            <CommentBox Postid={id} key={data.id || key} comment={data} fetchComments={fetchComments} />
          ))
      )}
    </div>
  );
}

export default PostComment;
