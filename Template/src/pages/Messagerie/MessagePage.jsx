// MessagesPage.jsx
import { useContext, useEffect, useState } from "react";
import SidebarUtilisateur from "../../components/Messagerie/Utilisateur/SidebarUtilisateur";
import SidebarGroupes from "../../components/Messagerie/Groupes/SidebarGroupes";
import Chatwindow from "../../components/Messagerie/Chatwindow";
import Welcome from "../../components/Messagerie/Welcome";
import CreateChatGroup from "../../components/Messagerie/Groupes/CreateChatGroup";
import GroupChat from "../../components/Messagerie/GroupeLayout/GroupChat";
import EditChatGroup from "../../components/Messagerie/Groupes/EditChatGroup";
import NewChat from "../../components/Messagerie/Nouvelle Conversation/NewChat";
import api from "../../components/axios";
import { AppContext } from "../../context/AppContext";

export default function MessagesPage({ setInstantNotif }) {
    const { user } = useContext(AppContext)
    const [sidebar, setSidebar] = useState("Utilisateurs");

    const [open, setOpen] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)

    const [selectedConversation, setSelectedConversation] = useState(null)
    const [selectedGroupChat, setSelectedGroupChat] = useState(null)
    const [selectedNewConversation, setSelectedNewConversation] = useState(null)


    const [conversationList, setConversationList] = useState([])
    const [allGroup, setAllGroup] = useState([])


    const fetchGroupConversation = (id) => {
        api.get('/users/' + id + '/message-groups')
            .then((response) => {
                setAllGroup(response.data.user.groups);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const fetchConversation = (id) => {
        api.get('/conversations/' + id)
            .then((response) => {
                setConversationList(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }


    useEffect(() => {
        fetchConversation(user.id)
        fetchGroupConversation(user.id)
    }, [user.id])


    return (
        <div className="flex h-[80vh] w-full bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-72 bg-white dark:bg-gray-800 border-r flex flex-col">
                <div className="p-4 font-bold text-xl  flex items-center justify-between">
                    Messagerie
                    <button onClick={() => {
                        setOpen(true)
                    }} 
                    className="cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-users-plus hover:text-sky-600">
                            <title> Créez un groupe de discussion</title>
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M5 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                            <path d="M3 21v-2a4 4 0 0 1 4 -4h4c.96 0 1.84 .338 2.53 .901" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            <path d="M16 19h6" />
                            <path d="M19 16v6" />
                        </svg>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="px-4 py-2 text-gray-500 text-md flex flex-row gap-5 items-center justify-center">
                        <span
                            onClick={() => setSidebar("Utilisateurs")}
                            className={`cursor-pointer ${sidebar === "Utilisateurs" ? "text-sky-700" : ""}`}
                        >
                            Utilisateurs
                        </span>

                        <span
                            onClick={() => setSidebar("Groupes")}
                            className={`cursor-pointer ${sidebar === "Groupes" ? "text-sky-700" : ""}`}
                        >
                            Groupes
                        </span>
                    </div>
                    {sidebar === "Utilisateurs" ? <SidebarUtilisateur setSelectedGroupChat={setSelectedGroupChat}
                        setSelectedConversation={setSelectedConversation}
                        setSelectedNewConversation={setSelectedNewConversation}
                        fetchConversation={fetchConversation}
                        conversationList={conversationList}
                    />
                        : <SidebarGroupes setSelectedGroupChat={setSelectedGroupChat}
                            setSelectedConversation={setSelectedConversation}
                            setSelectedNewConversation={setSelectedNewConversation}
                            allGroup={allGroup} />}
                </div>
            </aside>
            {/* Chat Window */}
            {
                selectedConversation ? <Chatwindow
                    conversationId={selectedConversation}
                    fetchConversationList={fetchConversation}
                    setInstantNotif={setInstantNotif}
                />
                    :
                    selectedGroupChat ? <GroupChat
                        groupId={selectedGroupChat}
                        setOpenEdit={setOpenEdit}
                        fetchGroupConversation={fetchGroupConversation}
                    /> :
                        selectedNewConversation ?
                            <NewChat UserId={selectedNewConversation}
                                fetchConversationList={fetchConversation}
                            /> :
                            <Welcome />
            }

            <CreateChatGroup open={open} onClose={() => { setOpen(false) }} fetchGroupConversation={fetchGroupConversation} /> 
            <EditChatGroup open={openEdit}
                onClose={() => { setOpenEdit(false) }}
                fetchGroupConversation={fetchGroupConversation}
                groupId={selectedGroupChat}
            />
        </div>
    );
}
