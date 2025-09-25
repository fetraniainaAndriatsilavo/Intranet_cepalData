import { useContext, useEffect, useRef, useState } from "react";
import HeaderBox from "./HeaderBox";
import MessageBox from "./MessageBox";
import InputBox from "./InputBox";
import api from "../axios";
import Pusher from "pusher-js";
import { AppContext } from "../../context/AppContext";

export default function Chatwindow({ conversationId, fetchConversationList, setInstantNotif }) {
    const { user } = useContext(AppContext)
    const messagesEndRef = useRef(null);
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageId, setMessageId] = useState(null);

    // Auto scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Fetch conversation
    const fetchConversation = (id) => {
        api.get(`/conversations/${id}/getConversation`)
            .then((res) => {
                setConversation(res.data.conversation);
                setMessages(res.data.conversation.messages);
            })
            .catch(console.log);
    };

    useEffect(() => {
        if (conversationId) fetchConversation(conversationId);
    }, [conversationId]);

    // Listen for new messages via Pusher
    useEffect(() => {
        if (!conversationId) return;

        const pusher = new Pusher('4f33dbef2b1faa768199', { cluster: 'eu' });
        const channel = pusher.subscribe(`conversation.${conversationId}`);

        channel.bind("UserMessageSent", (data) => {
            setMessages((prev) => [...prev, data]);

            setInstantNotif({
                sender_name: data.sender.first_name,
                content: data.content
            })

            setTimeout(() => {
                setInstantNotif(null)
            }, [2500])

            fetchConversationList?.(user.id);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [conversationId, fetchConversationList]);


    // Real-time message Suppression 
    useEffect(() => {
        const pusher = new Pusher("4f33dbef2b1faa768199", { cluster: "eu" });
        const channel = pusher.subscribe(`conversation.${conversationId}`);

        channel.bind("MessageUpdated", (data) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === data.id ? { ...msg, status: 'inactive' } : msg
                )
            );
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, [conversationId]);


    // Real-time "message.read" updates (e.g., sender sees it's been read)
    useEffect(() => {
        const pusher = new Pusher("4f33dbef2b1faa768199", { cluster: "eu" });
        const channel = pusher.subscribe(`conversation.${conversationId}`);

        channel.bind("MessageUpdated", (updatedMessage) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === updatedMessage.id ? updatedMessage : msg
                )
            );
        });
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, [conversationId]);


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
        <main className="flex flex-col flex-1 h-[80vh] bg-white dark:bg-gray-800 rounded">
            {conversation && (
                <>
                    {/* Header */}
                    <HeaderBox conversation={conversation}  fetchConversationList={fetchConversationList} />

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

                            elements.push(
                                <MessageBox
                                    key={msg.id || index}
                                    msg={msg}
                                    setMessageId={setMessageId}
                                    showTime={showTime} 
                                />
                            );

                            previousMessage = msg;
                            return elements;
                        })}
                        <div ref={messagesEndRef} />
                    </div>  

                    {/* Input box */}
                    <InputBox 
                        conversationId={conversationId}
                        setMessages={setMessages}
                        conversation={conversation}
                        messageId={messageId}
                        setMessageId={setMessageId}
                        fetchConversationList={fetchConversationList}
                    />
                </>
            )}


        </main>
    );
}
