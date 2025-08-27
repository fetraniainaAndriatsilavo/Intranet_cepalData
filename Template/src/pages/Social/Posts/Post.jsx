import PostHeader from "./PostHeader";
import PostBody from "./PostBody";
import PostFooter from "./PostFooter";
import PostComment from "./PostComment";
import { useState } from "react";
export default function Post({ data, fetchPost }) {
  const [open, setOpen] = useState(false)  
  const [commentCount, setCommentCount] = useState(data.comments_count || 0) 

  return (
    <div className="w-2/3 mb-1">
      <PostHeader username={data.user?.last_name + ' ' + data.user.first_name}  id={data.id} userID={data.user_id} created_at={data.created_at} fetchPost={fetchPost}> </PostHeader>
      <PostBody content={data.content} images={data.attachments || []}> </PostBody>
      <PostFooter setIsOpen={setOpen} id={data.id} open={open} comments={commentCount} likes={data.reactions_count}> </PostFooter>
      {
        open && <PostComment id={data.id} setCommentCount={setCommentCount}> </PostComment>
      }
    </div>
  );
}
