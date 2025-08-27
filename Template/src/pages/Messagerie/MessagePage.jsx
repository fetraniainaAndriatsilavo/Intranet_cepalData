// MessagesPage.jsx
import { useState } from "react";
import SidebarUtilisateur from "../../components/Messagerie/Utilisateur/SidebarUtilisateur";
import SidebarGroupes from "../../components/Messagerie/Groupes/SidebarGroupes";
import Chatwindow from "../../components/Messagerie/Chatwindow";
import Welcome from "../../components/Messagerie/Welcome";
import CreateChatGroup from "../../components/Messagerie/Groupes/CreateChatGroup";
import GroupChat from "../../components/Messagerie/GroupeLayout/GroupChat";
import EditChatGroup from "../../components/Messagerie/Groupes/EditChatGroup";

export default function MessagesPage() {
    const [messages, setMessages] = useState([]);

    const [sidebar, setSidebar] = useState("Utilisateurs");

    const [open, setOpen] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)

    const [selectedConversation, setSelectedConversation] = useState(null)
    const [selectedGroupChat, setSelectedGroupChat] = useState(null)
    const fetchGroupConversation = (id) => {
        api.get('/users/' + id + '/message-groups')
            .then((response) => {
                setAllGroup(response.data.users.groups);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className="flex h-[80vh] w-full bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-72 bg-white dark:bg-gray-800 border-r flex flex-col">
                <div className="p-4 font-bold text-xl  flex items-center justify-between">
                    Messagerie
                    <button onClick={() => {
                        setOpen(true)
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="hover:text-sky-700 cursor-pointer icon icon-tabler icons-tabler-outline icon-tabler-users-group">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                            <path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" />
                            <path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                            <path d="M17 10h2a2 2 0 0 1 2 2v1" />
                            <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                            <path d="M3 13v-1a2 2 0 0 1 2 -2h2" />
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
                    {sidebar === "Utilisateurs" ? <SidebarUtilisateur setSelectedGroupChat={setSelectedGroupChat} setSelectedConversation={setSelectedConversation} />
                        : <SidebarGroupes setSelectedGroupChat={setSelectedGroupChat} setSelectedConversation={setSelectedConversation} />}
                </div>
            </aside>
            {/* Chat Window */}
            {
                selectedConversation ? <Chatwindow 
                    conversationId={selectedConversation} />
                    : selectedGroupChat ? <GroupChat messages={messages}
                        setMessages={setMessages}
                        groupId={selectedGroupChat}
                        setOpenEdit={setOpenEdit}
                    /> : <Welcome />
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
