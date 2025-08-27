import { useContext, useEffect, useState } from "react";
import UserCard from "./UserCard";
import api from "../../axios";
import { AppContext } from "../../../context/AppContext";

export default function SidebarUtilisateur({ setSelectedConversation, setSelectedGroupChat }) {
    const { user } = useContext(AppContext)
    const [searchUser, setSearchUser] = useState('')
    const [allUser, setAllUser] = useState([])
    const [conversationList, setConversationList] = useState([])

    const fetchConversation = (id) => {
        api.get('/conversations/ ' + id)
            .then((response) => {
                setConversationList(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const fetchAllUser = () => {
        api.get('/getUser/all')
            .then((response) => {
                setAllUser(response.data.users);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchAllUser()
    }, []);

    useEffect(() => {
        fetchConversation(user.id)
    }, [user])

    const filteredUsers = allUser.filter((user) => {
        const name = user.first_name?.toLowerCase() || "";
        return (
            name.includes(searchUser.toLowerCase())
        );
    });

    return <>
        <div >
            <input
                className=" border-0 bg-gray-50 w-full text-sm text-center h-[60px]"
                placeholder="Recherchez des personnes,..."
                value={searchUser}
                onChange={(e) => {
                    setSearchUser(e.target.value)
                }}
            />
        </div>
        {
            searchUser && <span className="text-center flex items-center justify-center mt-1 mb-1 italic text-sm"> Nous avions trouvé : {filteredUsers ? filteredUsers.length : ''} utilisateur (s) </span>
        }
        <ul>
            {
                searchUser && filteredUsers ? filteredUsers.map((user, index) => {
                    return <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between">
                        <UserCard data={user} type={'search'} key={index}
                         setSelectedConversation={setSelectedConversation}
                         setSelectedGroupChat={setSelectedGroupChat}> </UserCard>
                    </li>
                }) : conversationList.length > 0 ? conversationList.map((conversation, index) => {
                    return <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between">
                        <UserCard data={conversation} type={'conversation'} key={index} 
                        setSelectedGroupChat={setSelectedGroupChat}
                         setSelectedConversation={setSelectedConversation}> </UserCard>
                    </li> 
                }) : <span className="flex  text-sm text-center items-center justify-center mt-3 "> Aucune discussion n’est disponible pour le moment.</span>
            }
        </ul >
    </>
}