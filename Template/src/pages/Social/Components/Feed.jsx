import Post from "../Posts/Post";
import CreatePost from "../Posts/CreatePost";
export default function Feed({posts, fetchPost}) {
  return (
    <div className="flex flex-col justify-center items-center ">
      <CreatePost  fetchPost={fetchPost}/>
      {posts.length > 0 &&
        posts.map((list, key) => <Post key={key} data={list} fetchPost={fetchPost}/>)}
    </div>
  );
}
