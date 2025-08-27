// Chatwindow.jsx
import { useEffect, useRef, useState } from "react";
import HeaderBox from "./HeaderBox";
import MessageBox from "./MessageBox";
import InputBox from "./InputBox";
import api from "../axios";

export default function Chatwindow({ conversationId }) {
    const messagesEndRef = useRef(null);
    const [conversation, setConversation] = useState(null)
    const [messages, setMessages] = useState([])
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

    return (
        <main className="flex flex-col flex-1 h-[80vh] bg-white dark:bg-gray-800 rounded">
            {
                conversation ? <>
                    {/* Header */}
                    <HeaderBox conversation={conversation ? conversation : {}} />

                    {/* Messages section */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages ? messages.map((msg, index) => (
                            <MessageBox key={index} msg={msg} />
                        )) : ''}
                        {/* Scroll target */}
                        <div ref={messagesEndRef} />
                    </div>
                    {/* Input box */}
                    <InputBox setMessages={setMessages} conversation={conversation ? conversation : {}} />
                </> : ''
            }

        </main>
    );
}
