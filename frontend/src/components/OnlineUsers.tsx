"use client";

import { User } from "@/types/user";

interface Props {
    users: User[];
    selectedUser: User | null;
    onSelect: (user: User) => void;
}

export default function OnlineUsers({ users, selectedUser, onSelect }: Props) {
    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        Online Users
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                        {users.length} online
                    </span>
                </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto">
                {users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
                        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-sm">No users online</p>
                        <p className="text-xs mt-1">Users will appear here when they connect</p>
                    </div>
                ) : (
                    <div className="py-2">
                        {users.map((user) => {
                            const isSelected = selectedUser?._id === user._id;

                            return (
                                <button
                                    key={user._id}
                                    onClick={() => onSelect(user)}
                                    className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 
                    hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500
                    ${isSelected
                                            ? "bg-indigo-50 border-l-4 border-indigo-600"
                                            : "border-l-4 border-transparent"
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium
                      ${isSelected ? "bg-indigo-600" : "bg-gray-400"}`}>
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        {/* Online indicator */}
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0 text-left">
                                        <p className={`text-sm font-medium truncate
                      ${isSelected ? "text-indigo-900" : "text-gray-900"}`}>
                                            {user.username}
                                        </p>
                                        <p className="text-xs text-green-600 font-medium">
                                            Online
                                        </p>
                                    </div>

                                    {/* Unread indicator (if you have unread messages) */}
                                    {isSelected && (
                                        <div className="flex-shrink-0">
                                            <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}