
import { useEffect, useRef, useState } from "react";
import GroupHeader from "./GroupHeader";
import GroupInput from "./GroupInput";
import MessageBox from "../MessageBox";
import api from "../../axios";
import MessageGroupBox from "./MessageGroupBox";

export default function GroupChat({ groupId, setOpenEdit }) {
    const [messages, setMessages] = useState([])
    const messagesEndRef = useRef(null);
    const [group, setGroup] = useState({
        id: groupId ? groupId : 0,
        name: '',
        members: [],
        updated_by: 0,
        updated_at: '',
    })

    const [messageId, setMessageId] = useState(null)

    // Auto scroll to bottom on new messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const fetchGroupInformation = (id) => {
        api.get('/message-groups/' + id + '/info')
            .then((response) => {
                const group = response.data.group
                setGroup({
                    id: group.id,
                    name: group.name,
                    members: group.members,
                    updated_at: group.updated_at,
                    updated_by: group.updated_by
                })
                setMessages(response.data.messages)
                console.log(group)
            })
            .catch(() => {
            })
    }

    useEffect(() => {
        if (groupId) {
            fetchGroupInformation(groupId)
        }
    }, [groupId])



    // renvoie le message instantanément 
    useEffect(() => {
        // Pusher.logToConsole = true;

        const pusher = new Pusher('4f33dbef2b1faa768199', {
            cluster: 'eu',
        });

        const channel = pusher.subscribe("group." + groupId);
        console.log("group." + groupId)
        channel.bind("UserMessageSent", (data) => {
            console.log("New message received:", data);
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            // pusher.disconnect();
        };
    }, []);


    return (
        <>
            {
                group && messages && <main className="flex flex-col flex-1 h-[80vh] bg-white dark:bg-gray-800 rounded">
                    {/* Header */}
                    <GroupHeader groupId={groupId} group={group ? group : {}} setOpenEdit={setOpenEdit}> </GroupHeader>
                    {/* Messages section */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, index) => (
                            <MessageGroupBox key={index} msg={msg} setMessageId={setMessageId} />
                        ))}
                        {/* Scroll target */}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input box */}
                    <GroupInput setMessages={setMessages} groupId={groupId} messageId={messageId} setMessageId={setMessageId} />
                </main>
            }
        </>

    );
}
