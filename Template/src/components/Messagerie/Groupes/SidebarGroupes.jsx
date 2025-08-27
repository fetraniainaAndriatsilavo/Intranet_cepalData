import { useContext, useEffect, useState } from "react";
import GroupCard from "./GroupCard";
import { AppContext } from "../../../context/AppContext";
import api from "../../axios";

export default function SidebarGroupes({ setSelectedGroupChat, setSelectedConversation }) {
    const { user } = useContext(AppContext)
    const [searchGroup, setSearchGroup] = useState('')
    const [allGroup, setAllGroup] = useState([])

    const filteredGroup = allGroup.filter((group) => {
        const name = group.first_name?.toLowerCase() || "";
        return (
            name.includes(searchGroup.toLowerCase())
        );
    });

    const fetchGroupConversation = (id) => {
        api.get('/users/' + id + '/message-groups')
            .then((response) => {
                setAllGroup(response.data.user.groups);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchGroupConversation(user.id)
    }, [user])

    return <>
        <input
            className=" border-0 bg-gray-50 w-full text-sm text-center h-[60px]"
            placeholder="Recherchez des groupes,..."
            value={searchGroup}
            onChange={(e) => {
                setSearchGroup(e.target.value)
            }}
        />

        {
            searchGroup && <span className="text-center flex items-center justify-center mt-1 mb-1 italic text-sm"> Nous avions trouvé : {filteredGroup ? filteredGroup.length : ''} groupe (s) </span>
        }
        <ul>
            {
                searchGroup && filteredGroup.length > 0 ? (
                    filteredGroup.map((selectedGroup) => (
                        <li
                            key={selectedGroup.id}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between"
                        >
                            <GroupCard data={selectedGroup}
                                setSelectedConversation={setSelectedConversation}
                                setSelectedGroupChat={setSelectedGroupChat} />
                        </li>
                    ))
                ) : allGroup.length > 0 ? (
                    allGroup.map((group) => (
                        <li
                            key={group.id}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between"
                        >
                            <GroupCard data={group}
                                setSelectedConversation={setSelectedConversation}
                                setSelectedGroupChat={setSelectedGroupChat} />
                        </li>
                    ))
                ) : (
                    <li className="flex text-sm text-center items-center justify-center mt-3">
                        Aucune discussion de groupe n’est disponible pour le moment.
                    </li>
                )
            }
        </ul>
    </>
}