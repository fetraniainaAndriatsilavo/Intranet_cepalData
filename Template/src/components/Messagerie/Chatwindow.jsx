// Chatwindow.jsx
import { useEffect, useRef, useState } from "react";
import HeaderBox from "./HeaderBox";
import MessageBox from "./MessageBox";
import InputBox from "./InputBox";
import api from "../axios";
import Pusher from "pusher-js";

export default function Chatwindow({ conversationId }) {
    const messagesEndRef = useRef(null);
    const [conversation, setConversation] = useState(null)
    const [messages, setMessages] = useState([])

    const [messageId, setMessageId] = useState(null)
    // Auto scroll to bottom on new messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const fetchConversation = (id) => {
        api.get('/conversations/' + id + '/getConversation')
            .then((response) => {
                setConversation(response.data.conversation)
                setMessages(response.data.conversation.messages)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        fetchConversation(conversationId)
    }, [conversationId])


    // renvoie le message instantanément 
    useEffect(() => {
        // Pusher.logToConsole = true;

        const pusher = new Pusher('4f33dbef2b1faa768199', {
            cluster: 'eu',
        });

        const channel = pusher.subscribe("conversation." + conversationId);
        console.log("private-conversation."+ conversationId)
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
        <main className="flex flex-col flex-1 h-[80vh] bg-white dark:bg-gray-800 rounded">
            {
                conversation ? <>
                    {/* Header */}
                    <HeaderBox conversation={conversation ? conversation : {}} />

                    {/* Messages section */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages ? messages.map((msg, index) => (
                            <MessageBox key={index} msg={msg} setMessageId={setMessageId} />
                        )) : ''}
                        {/* Scroll target */}
                        <div ref={messagesEndRef} />
                    </div> 
                    {/* Input box */}
                    <InputBox setMessages={setMessages}
                     conversation={conversation ? conversation : {}} 
                     messageId={messageId}
                      setMessageId={setMessageId}  
                      />
                </> : ''
            }

        </main>
    );
}
