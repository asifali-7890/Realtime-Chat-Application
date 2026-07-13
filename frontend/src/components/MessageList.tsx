"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types/message";
import { useSocketContext } from "@/context/SocketContext";
import TypingIndicator from "./TypingIndicator";

interface Props {
    messages: Message[];
    currentUserId: string;
}

export default function MessageList({ messages, currentUserId }: Props) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { selectedUser, typingUser } = useSocketContext();
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatTime = (timestamp?: string) => {
        if (!timestamp) return "";
        return new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const isSelectedUserTyping =
        !!selectedUser && !!typingUser && typingUser.id === selectedUser.id;

    return (
        <div className="h-full flex flex-col bg-gray-50">
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p className="mt-2">No messages yet. Start the conversation!</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMine = msg.senderId === currentUserId;
                        const showAvatar =
                            index === 0 ||
                            messages[index - 1]?.senderId !== msg.senderId;

                        return (
                            <div
                                key={msg.id || index}
                                className={`flex ${isMine ? "justify-end" : "justify-start"} 
                           ${!showAvatar ? "mt-1" : "mt-4"}`}
                            >
                                <div className={`flex items-end gap-2 max-w-[70%] 
                              ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                                    {/* Avatar */}
                                    {showAvatar && (
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium
                                  ${isMine ? "bg-indigo-600" : "bg-gray-500"}`}>
                                            {isMine ? "M" : "T"}
                                        </div>
                                    )}

                                    {/* Message Bubble */}
                                    <div className={`group relative ${!showAvatar && (isMine ? "mr-10" : "ml-10")}`}>
                                        <div
                                            className={`px-4 py-2 rounded-2xl shadow-sm
                        ${isMine
                                                    ? "bg-indigo-600 text-white rounded-br-md"
                                                    : "bg-white text-gray-800 rounded-bl-md border border-gray-200"
                                                }`}
                                        >
                                            {/* Sender name for group chats */}
                                            {showAvatar && !isMine && (
                                                <p className="text-xs font-medium text-indigo-600 mb-1">
                                                    {msg.senderId || "User"}
                                                </p>
                                            )}

                                            <p className="text-sm leading-relaxed break-words">
                                                {msg.message}
                                            </p>

                                            {/* Timestamp */}
                                            <div className={`flex items-center gap-1 mt-1 
                                    ${isMine ? "justify-end" : "justify-start"}`}>
                                                <span className={`text-[10px] 
                                      ${isMine ? "text-indigo-200" : "text-gray-400"}`}>
                                                    {formatTime(msg.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                {isSelectedUserTyping && (
                    <TypingIndicator username={selectedUser?.username || ""} />
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}