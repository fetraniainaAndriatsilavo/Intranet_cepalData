import { useContext, useEffect, useState } from "react";
import UserCard from "./UserCard";
import api from "../../axios";
import { AppContext } from "../../../context/AppContext";

export default function SidebarUtilisateur({ setSelectedConversation, setSelectedGroupChat, setSelectedNewConversation, conversationList, fetchConversation }) {
    const { user } = useContext(AppContext)
    const [searchUser, setSearchUser] = useState('')
    const [allUser, setAllUser] = useState([])


    const fetchAllUser = async () => {
        try {
            const usersRes = await api.get('/getUser/all');
            const convRes = await api.get('/conversations/' + user.id);

            const allUsers = usersRes.data.users;
            const conversations = convRes.data;

            const existingIds = conversations.map(conv => {
                return conv.user_one_id === user.id ? conv.user_two_id : conv.user_one_id;
            });

            const filteredUsers = allUsers.filter(u => !existingIds.includes(u.id) && u.id !== user.id);

            setAllUser(filteredUsers);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAllUser()
    }, []);


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
                            setSelectedGroupChat={setSelectedGroupChat}
                            setSelectedNewConversation={setSelectedNewConversation}
                            setSearchUser={setSearchUser}
                            fetchConversation={fetchConversation}
                            > </UserCard>
                    </li>
                }) : conversationList && conversationList.length > 0 ? conversationList.map((conversation, index) => {
                    return <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between">
                        <UserCard data={conversation} type={'conversation'} key={index}
                            setSelectedGroupChat={setSelectedGroupChat}
                            setSelectedConversation={setSelectedConversation}
                            setSelectedNewConversation={setSelectedNewConversation}> </UserCard>
                    </li>
                }) : <span className="flex  text-sm text-center items-center justify-center mt-3 "> Aucune discussion n’est disponible pour le moment.</span>
            }
        </ul >
    </>
}