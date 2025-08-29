import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import NewChatHeader from "./NewChatHeader";
import NewMessageBox from "./NewMessageBox";
import NewInputBox from "./NewInputBox";
import api from "../../axios";

export default function NewChat({ UserId }) {
    const messagesEndRef = useRef(null);
    const [conversation, setConversation] = useState(null)
    const [messages, setMessages] = useState([])

    const [messageId, setMessageId] = useState(null)

    const [user, setUser] = useState(null)

    const fetchUserInformation = (id) => {
        api.get('/user/' + id + '/info')
            .then((response) => {
                const userdetail = response.data.user
                setUser(userdetail)
            })
    }

    useEffect(() => {
        fetchUserInformation(UserId)
    }, [UserId])


    // Auto scroll to bottom on new messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // renvoie le message instantanément 
    useEffect(() => {
        const pusher = new Pusher('4f33dbef2b1faa768199', {
            cluster: 'eu',
        });

        const channel = pusher.subscribe("conversation." + UserId);
        console.log("private-conversation." + UserId)
        channel.bind("UserMessageSent", (data) => {
            console.log("New message received:", data);
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);



    return (
        <main className="flex flex-col flex-1 h-[80vh] bg-white dark:bg-gray-800 rounded">
            {
                user && UserId ? <>
                    {/* Header */}
                    <NewChatHeader user={user ? user : {}} />

                    {/* Messages section */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages ? messages.map((msg, index) => (
                            <NewMessageBox key={index} msg={msg} setMessageId={setMessageId} />
                        )) : ''}
                        {/* Scroll target */}
                        <div ref={messagesEndRef} />
                    </div>
                    {/* Input box */}
                    <NewInputBox setMessages={setMessages}
                        receiverId={UserId}
                        messageId={messageId}
                        setMessageId={setMessageId}
                    />
                </> : ''
            }

        </main>
    );
}
