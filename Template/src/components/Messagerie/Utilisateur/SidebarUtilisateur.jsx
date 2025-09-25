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
        const first_name = user.first_name?.toLowerCase() || "";
        const last_name = user.last_name?.toLowerCase() || "";
        return (
            first_name.includes(searchUser.toLowerCase()) ||
            last_name.includes(searchUser.toLowerCase())
        );
    });


    return <>
        <div className="flex items-center justify-center">
            <div className="relative w-full">
                <input
                    className="pl-10 pr-4 border-0 bg-gray-50 text-sm text-center h-[50px] w-full"
                    placeholder="Recherchez des personnes..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-search">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                        <path d="M21 21l-6 -6" />
                    </svg>
                </span>
            </div>

        </div>
        {
            searchUser && <span className="text-center flex items-center justify-center mt-1 mb-1 italic text-sm"> Nous avons trouvé : {filteredUsers ? filteredUsers.length : ''} utilisateur(s) </span>
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