"use client";

import { useState } from "react";

interface Props {
    onSend: (message: string) => void;
}

export default function ChatInput({
    onSend,
}: Props) {
    const [message, setMessage] = useState("");

    return (
        <div className="flex gap-2">
            <input
                value={message}
                placeholder="Type message..."
                className="border border-gray-300 rounded-md p-2"
                onChange={(e) =>
                    setMessage(e.target.value)
                }
            />
            <button
                className="bg-blue-500 text-white rounded-md p-2"
                onClick={() => {
                    console.log("Clicked send button");
                    if (!message.trim()) return;
                    onSend(message);
                    setMessage("");
                }}
            >
                Send
            </button>
        </div>
    );
}