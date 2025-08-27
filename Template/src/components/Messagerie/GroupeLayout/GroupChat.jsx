
import { useEffect, useRef, useState } from "react";
import GroupHeader from "./GroupHeader";
import GroupInput from "./GroupInput";
import MessageBox from "../MessageBox";
import api from "../../axios";

export default function GroupChat({ messages, setMessages, groupId, setOpenEdit }) {
    const messagesEndRef = useRef(null);

    const [group, setGroup] = useState({
        id: groupId ? groupId : 0,
        name: '',
        members: [],
        updated_by: 0,
        updated_at: '',
    })
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
                console.log(group)
            })
            .catch(() => {
                // fetchGroupInformation(id)
            })
    }

    useEffect(() => {
        if (groupId) {
            fetchGroupInformation(groupId)
        }
    }, [groupId])

    return (
        <main className="flex flex-col flex-1 h-[80vh] bg-white dark:bg-gray-800 rounded">
            {/* Header */}
            <GroupHeader groupId={groupId} group={group ? group : {}} setOpenEdit={setOpenEdit}> </GroupHeader>
            {/* Messages section */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <MessageBox key={index} msg={msg} />
                ))}
                {/* Scroll target */}
                <div ref={messagesEndRef} />
            </div> 

            {/* Input box */}
            <GroupInput setMessages={setMessages} groupId={groupId} />
        </main>
    );
}
