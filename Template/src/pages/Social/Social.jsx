import { useContext, useEffect, useState } from "react";
import Feed from "./Components/Feed";
import Events from "./Events/Events";
import Grouplist from "./Groups/Grouplist";
import { AppContext } from "../../context/AppContext";
import api from "../../components/axios";
import { BeatLoader, PulseLoader } from "react-spinners";

export default function Social() {
  const [lists, setLists] = useState([]);
  const { user } = useContext(AppContext)
  const [groups, setGroups] = useState([]);
  const [opened, setOpened] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchPost = () => {
    setLoading(true)
    api
      .get("/posts/published")
      .then((response) => {
        setLists(response.data.posts);
        setLoading(false)
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false)
      })
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
          {
            loading ? (
              <div className="flex items-center justify-center w-full h-full">
                <BeatLoader
                  color={"#1a497f"}
                  loading={loading}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            ) : (
              <Feed posts={lists || []} fetchPost={fetchPost} />
            )
          }
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
