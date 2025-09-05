import { useContext, useEffect, useState } from "react";
import Feed from "./Components/Feed";
import Events from "./Events/Events";
import Grouplist from "./Groups/Grouplist";
import { AppContext } from "../../context/AppContext";
import api from "../../components/axios";

export default function Social() {
  const [lists, setLists] = useState([]);
  const { user } = useContext(AppContext)
  const [groups, setGroups] = useState([]);
  const [opened, setOpened] = useState(false)

  const fetchPost = () => {
    api
      .get("/posts/published")
      .then((response) => {
        setLists(response.data.posts);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const fetchUserGroup = (id) => {
    api
      .get(`/users/${user.id}/groups`)
      .then((response) => {
        setGroups(response.data.groups);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchPost()
  }, []);

  useEffect(() => {
    fetchUserGroup(user.id)
  }, [user]);

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Main Content: Flex row taking remaining height */}
      <div className="flex flex-grow overflow-hidden w-full gap-6">
        {/* Feed - scrollable */}
        <div className="flex-grow p-2 overflow-y-auto">
          <Feed posts={lists || []} fetchPost={fetchPost} />
        </div>

        {/* Right Sidebar - fixed height */}
        <div className="w-full max-w-xs hidden lg:block p-3 px-6 overflow-y-auto">
          <div className="mb-3 gap-3 flex flex-col">
            <Grouplist userID={user.id} lists={groups || []} fetchUserGroup={fetchUserGroup} />
            <Events setOpen={setOpened} />
          </div>
        </div>
      </div>
    </div>
  );
}
