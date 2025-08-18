import PostHeader from "./PostHeader";
import PostBody from "./PostBody";
import PostFooter from "./PostFooter";
import PostComment from "./PostComment";
import { useState } from "react";
export default function Post({ data, fetchPost }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="w-2/3 mb-1">
      <PostHeader username={data.user.last_name + ' ' + data.user.first_name}  id={data.id} userID={data.user_id} created_at={data.created_at} fetchPost={fetchPost}> </PostHeader>
      <PostBody content={data.content} images={data.attachments || []}> </PostBody>
      <PostFooter setIsOpen={setOpen} id={data.post_id} open={open} comments={data.comment_count} likes={data.likes_count}> </PostFooter>
      {
        open && <PostComment id={data.post_id}> </PostComment>
      }
    </div>
  );
}
