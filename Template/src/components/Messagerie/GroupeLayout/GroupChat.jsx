
import { useEffect, useRef, useState } from "react";
import GroupHeader from "./GroupHeader";
import GroupInput from "./GroupInput";
import api from "../../axios";
import MessageGroupBox from "./MessageGroupBox";

export default function GroupChat({ groupId, setOpenEdit, fetchGroupConversation }) {
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


    // Date/time helpers
    const isNewDay = (prev, current) => prev.toDateString() !== current.toDateString();

    const shouldShowTime = (prevMsg, currMsg) => {
        if (!prevMsg) return true;
        const prev = new Date(prevMsg.created_at);
        const curr = new Date(currMsg.created_at);
        return prevMsg.sender_id !== currMsg.sender_id || curr - prev > 2 * 60 * 1000;
    };

    const formatDateLabel = (str) => {
        const d = new Date(str);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (d.toDateString() === today.toDateString()) return "Aujourd’hui";
        if (d.toDateString() === yesterday.toDateString()) return "Hier";

        return d.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const DateSeparator = ({ date }) => (
        <div className="text-center text-gray-400 text-sm my-2">
            {formatDateLabel(date)}
        </div>
    );

    // Render
    let previousMessage = null;

    return (
        <>
            {
                group && messages && <main className="flex flex-col flex-1 h-[80vh] bg-white dark:bg-gray-800 rounded">
                    {/* Header */}
                    <GroupHeader groupId={groupId} group={group ? group : {}} setOpenEdit={setOpenEdit}> </GroupHeader>
                    {/* Messages section */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, index) => {
                            const currentDate = new Date(msg.created_at);
                            const prevDate = previousMessage ? new Date(previousMessage.created_at) : null;

                            const showDateSeparator = !previousMessage || isNewDay(prevDate, currentDate);
                            const showTime = shouldShowTime(previousMessage, msg);

                            const elements = [];

                            if (showDateSeparator) {
                                elements.push(<DateSeparator key={`date-${index}`} date={msg.created_at} />);
                            }

                            elements.push(<MessageGroupBox key={index}
                                msg={msg}
                                setMessageId={setMessageId}
                                showTime={showTime}
                            />)
                            previousMessage = msg;
                            return elements;
                        }
                        )}
                        {/* Scroll target */}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input box */}
                    <GroupInput setMessages={setMessages}
                        groupId={groupId}
                        messageId={messageId}
                        setMessageId={setMessageId}
                        fetchGroupConversation={fetchGroupConversation} />
                </main>
            }
        </>

    );
}
