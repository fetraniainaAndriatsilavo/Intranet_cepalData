import EmojiPicker from "emoji-picker-react";
import { useContext, useEffect, useRef, useState } from "react";
import api from "../axios";
import { AppContext } from "../../context/AppContext";

export default function InputBox({ conversation }) {
    const { user } = useContext(AppContext)
    const [sending, setSending] = useState(false)
    const [input, setInput] = useState("");
    const [picture, setPicture] = useState([])
    const emojiButtonRef = useRef(null);
    const [isShown, setIsShown] = useState(false);

    const [receiver, setReceiver] = useState(null)

    useEffect(() => {
        if (conversation?.user_one && conversation?.user_two) {
            if (conversation.user_one.id === user.id) {
                setReceiver(conversation.user_two?.id || 0);
            } else {
                setReceiver(conversation.user_one?.id || 0);
            }
        }
    }, [conversation])

    const handleSend = () => {
        if (!input.trim()) return;
        setSending(true)
        api.post('/messages', {
            content: input,
            sender_id: user.id,
            receiver_id: receiver,
            conversationId: conversation.id,
            status: 'active'
        })
            .then(() => { 
                alert('message envoyés')
                // setMessages([...messages, { content: input, sender_id: user.id, conversationId: "", status: "sent" }]);
            })
            .catch(() => {

            })
            .finally(() => {
                setSending(false)
            })
    };

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                emojiButtonRef.current &&
                !emojiButtonRef.current.contains(event.target)
            ) {
                setIsShown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle emoji selection
    const handleEmojiClick = (emojiData) => {
        setMessages((prev) => prev + emojiData.emoji);
    };

    // Handle file input change (support multiple)
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setPicture((prev) => [...prev, ...files]);
    };

    return <div className="border-t p-3 flex items-center bg-white dark:bg-gray-800">
        <label htmlFor="files" className="mr-1 cursor-pointer hover:bg-gray-100 p-2 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-paperclip">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5" />
            </svg>
        </label>
        <input
            type="file"
            name="files[]"
            id="files"
            accept=".png,.jpg,.jpeg,.mp4,.pdf,.xlsx,.docx,.ppt,.pptx"
            hidden
            onChange={handleFileChange}
            multiple
        />
        {/* Emoji picker */}
        <div className="relative" ref={emojiButtonRef}>
            <span
                className="cursor-pointer ml-1 mr-1 flex "
                onClick={() => setIsShown((prev) => !prev)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="hover:text-yellow-400 icon icon-tabler icons-tabler-filled icon-tabler-mood-happy">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-2 9.66h-6a1 1 0 0 0 -1 1v.05a3.975 3.975 0 0 0 3.777 3.97l.227 .005a4.026 4.026 0 0 0 3.99 -3.79l.006 -.206a1 1 0 0 0 -1 -1.029zm-5.99 -5l-.127 .007a1 1 0 0 0 .117 1.993l.127 -.007a1 1 0 0 0 -.117 -1.993zm6 0l-.127 .007a1 1 0 0 0 .117 1.993l.127 -.007a1 1 0 0 0 -.117 -1.993z" />
                </svg>
            </span>
            {isShown && (
                <div className="absolute bottom-12 left-0 z-50">
                    <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        width={300}
                        height={400}
                    />
                </div>
            )}
        </div>
        <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ecrivez votre message ici...."
            className="flex-1 rounded-full border-0 bg-gray-50 focus:bg-gray-100 px-4 py-2 focus:outline-none"
        />
        <button
            onClick={handleSend}
            className="ml-3 bg-sky-600 text-white rounded-full p-2 hover:bg-sky-700 cursor-pointer flex items-center justify-center"
        >
            {
                sending == false
                    ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-send-2">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
                        <path d="M6.5 12h14.5" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-send">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 14l11 -11" />
                        <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                    </svg>
            }
        </button>
    </div>
}
