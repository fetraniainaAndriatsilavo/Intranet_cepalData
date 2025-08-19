import { useParams } from "react-router-dom";
import SocialNavbar from "../Components/SocialNavbar";
import CreatePost from "../Posts/CreatePost";
import GroupInfo from "./GroupInfo";
import { useEffect, useState } from "react";
import Post from "../Posts/Post";
import api from "../../../components/axios";

export default function Group() {
  const { id } = useParams();
  const [lists, setLists] = useState([]);

  useEffect(() => {
    api.get("/group_posts/" + id + "/posts")
      .then((response) => {
        setLists(response.data.posts);
      }) 
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  return (
    <div className="w-full">
      <div className="flex gap-1 w-full flex-col items-center justify-center p-2">
        <GroupInfo GroupId={id}> </GroupInfo>
        <CreatePost GroupId={id}> </CreatePost>
        {lists.length > 0 &&
          lists.map((post, key) => (
            <Post key={key} data={post}>
              {" "}
            </Post>
          ))} 
      </div>
    </div>
  );
}
