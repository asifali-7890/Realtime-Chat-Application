"use client";

import { useSocketContext } from "@/context/SocketContext";
import { useState, useRef, KeyboardEvent, useEffect } from "react";

interface Props {
    onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: Props) {
    const [message, setMessage] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { selectedUser, sendTyping, stopTyping } = useSocketContext();

    // ✅ Fire typing on every keystroke
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        sendTyping(selectedUser?.id || "");

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            stopTyping(selectedUser?.id || "");
        }, 600);
    };

    const handleSend = () => {
        if (!message.trim()) return;
        onSend(message.trim());
        setMessage("");
        inputRef.current?.focus();

        // ✅ Stop typing immediately when sending
        if (selectedUser?.id) {
            stopTyping(selectedUser.id);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // ✅ Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 
                     focus:border-transparent transition-all duration-200
                     bg-gray-50 hover:bg-white placeholder-gray-400"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
                {message && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        {message.length}
                    </span>
                )}
            </div>

            <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="px-5 py-3 bg-indigo-600 text-white rounded-xl font-medium
                   hover:bg-indigo-700 focus:outline-none focus:ring-2 
                   focus:ring-indigo-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 flex items-center gap-2
                   active:scale-95 transform"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span className="hidden sm:inline">Send</span>
            </button>
        </div>
    );
}