import { useEffect, useState } from "react";
import {addMessage, deleteMessage, getMessages} from "../services/messageService.jsx";

export default function MessagesPage() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        getMessages().then(setMessages);
    }, []);

    const handleAddMessage = async () => {
        if (!newMessage.trim()) return;
        await addMessage(newMessage);
        setNewMessage(""); // clear input
        getMessages().then(setMessages); // refresh list
    };

    const handleRemoveMessage = async (id) => {
        await deleteMessage(id);
        getMessages().then(setMessages);
    }

    return (
        <div>
            <h1>Messages</h1>
            <ul>
                {messages.map((msg) => (
                    <li key={msg.id}>{msg.content}
                    <button onClick={() => handleRemoveMessage(msg.id)}>X</button>
                    </li>
                ))}
            </ul>

            <h2>Insert message</h2>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Enter message"
            />
            <button onClick={handleAddMessage}>Add Message</button>
        </div>
    );
}
