import EmojiPicker from "emoji-picker-react";
import { useContext, useEffect, useRef, useState } from "react";
import api from "../../axios";
import { AppContext } from "../../../context/AppContext";

export default function NewInputBox({ receiverId, messageId, setMessageId, setMessages, fetchConversationList }) {
    const { user } = useContext(AppContext)

    const [sending, setSending] = useState(false)
    const [input, setInput] = useState("");
    const [picture, setPicture] = useState([])
    const emojiButtonRef = useRef(null);
    const [isShown, setIsShown] = useState(false);

    const [send, setSend] = useState(false)

    // donne les informations d'une message
    // const fetchMessageInfo = (id) => {
    //     api.get('/messages/' + id + '/getMessage/message')
    //         .then((response) => {
    //             setInput(response.data.content)
    //         })
    // }

    // envoie d'une message
    const handleSend = () => {
        if (!input.trim()) return;
        setSending(true)
        api.post('/messages', {
            content: input,
            sender_id: user.id,
            receiver_id: receiverId,
            status: 'active',
            attachments: picture
        })
            .then((response) => {
                setMessages((prev) => [...prev, response.data.message]);
                fetchConversationList(user.id)
                setInput('')
                setPicture([])
            })
            .catch(() => {

            })
            .finally(() => {
                setSending(false)
            })
    };

    // update d'une message
    const UpdateMessage = (id) => {
        setSending(true)
        if (!input.trim() && picture.length === 0) return;
        api.put('/messages/' + id + '/update', {
            content: input,
        }, {
            headers: {
                 "Content-Type": 'multipart/form-data'
            }
        })
            .then(() => {
                setMessageId(null)
            })
            .finally(() => {
                setSending(false)
            })
    }


    // transmission de l'information du message 
    // useEffect(() => {
    //     if (messageId) {
    //         fetchMessageInfo(messageId)
    //     }
    // }, [messageId])

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
        setInput((prev) => prev + emojiData.emoji);
    };

    // Handle file input change (support multiple)
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setPicture((prev) => [...prev, ...files]);
    };

    return <div className="border-t p-3 bg-white dark:bg-gray-800">
        {/* File Preview Section */}
        {picture.length > 0 && (
            <div className="flex flex-row flex-wrap gap-2 p-2 bg-white items-center justify-start">
                {picture.map((file, key) => {
                    const fileUrl = URL.createObjectURL(file);

                    const renderPreview = () => {
                        if (file.type.startsWith("image/")) {
                            return <img src={fileUrl} alt={file.name} className="w-20 h-20 object-cover rounded" />;
                        } else if (file.type.startsWith("video/")) {
                            return <video src={fileUrl} controls className="w-40 h-24 rounded" />;
                        } else if (file.name.endsWith(".pdf")) {
                            return (
                                <div className="flex flex-col items-center justify-center w-24 h-24 bg-red-50 text-red-600 rounded p-2 truncate">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
                                    </svg>
                                    <span className="text-xs text-center">{file.name}</span>
                                </div>
                            );
                        } else if (file.name.endsWith(".docx")) {
                            return (
                                <div className="flex flex-col items-center justify-center w-24 h-24 bg-blue-50 text-blue-600 rounded p-2 truncate">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
                                    </svg>
                                    <span className="text-xs text-center">{file.name}</span>
                                </div>
                            );
                        } else if (file.name.endsWith(".xlsx")) {
                            return (
                                <div className="flex flex-col items-center justify-center w-24 h-24 bg-green-50 text-green-600 rounded p-2 truncate">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
                                    </svg>
                                    <span className="text-xs text-center ">{file.name}</span>
                                </div>
                            );
                        } else if (file.name.endsWith(".ppt") || file.name.endsWith(".pptx")) {
                            return (
                                <div className="flex flex-col items-center justify-center w-24 h-24 bg-orange-50 text-orange-600 rounded p-2 truncate">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
                                    </svg>
                                    <span className="text-xs text-center">{file.name}</span>
                                </div>
                            );
                        } else {
                            return (
                                <div className="flex flex-col items-center justify-center w-24 h-24 bg-gray-100 text-gray-600 rounded p-2 truncate">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
                                    </svg>
                                    <span className="text-xs text-justify">{file.name}</span>
                                </div>
                            );
                        }
                    };

                    return (
                        <div key={key} className="relative group">
                            {renderPreview()}
                            <button
                                onClick={() => setPicture((prev) => prev.filter((_, index) => index !== key))}
                                className="absolute top-0 right-0 bg-gray-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-70 group-hover:opacity-100"
                                title="Remove"
                            >
                                ×
                            </button>
                        </div>
                    );
                })}
            </div>
        )}

        {/* Input Row */}
        <div className="flex items-center mt-2">
            <label
                htmlFor="files"
                className="mr-1 cursor-pointer hover:bg-gray-100 p-2 rounded"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-paperclip"
                >
                    <title> pièces jointe  </title>
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

            {/* Emoji Picker */}
            <div className="relative" ref={emojiButtonRef}>
                <span
                    className="cursor-pointer ml-1 mr-1 flex"
                    onClick={() => setIsShown((prev) => !prev)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="hover:text-yellow-400 icon icon-tabler icons-tabler-filled icon-tabler-mood-happy"
                    >
                        <title> Emoji </title>
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

            {/* Text Input */}
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ecrivez votre message ici...."
                className="flex-1 rounded-full border-0 bg-gray-50 focus:bg-gray-100 px-4 py-2 focus:outline-none"
            />
            {/* Send Button */}
            {
                (input || picture.length > 0) && <button
                    onClick={() => {
                        if (messageId) {
                            UpdateMessage(messageId)
                        } else {
                            handleSend()
                        }
                    }
                    }

                    onMouseOver={() => {
                        setSend(true)
                    }}

                    onMouseOut={() => {
                        setSend(false)
                    }}

                    className="ml-3 bg-sky-600 text-white rounded-full p-2 hover:bg-sky-700 cursor-pointer flex items-center justify-center"
                >
                    {(send && sending == false) ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="icon icon-tabler icons-tabler-outline icon-tabler-send"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M10 14l11 -11" />
                            <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                        </svg>
                    ) : (!send && sending == true) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-progress">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969" />
                        <path d="M14 3.223a9.003 9.003 0 0 1 0 17.554" />
                        <path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592" />
                        <path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305" />
                        <path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356" />
                    </svg> :
                        (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="icon icon-tabler icons-tabler-outline icon-tabler-send-2"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
                                <path d="M6.5 12h14.5" />
                            </svg>
                        )}
                </button>
            }
        </div>
    </div>
}
