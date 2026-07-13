"use client";

import { useState, KeyboardEvent } from "react";

type Props = {
    onConnect: (username: string) => void;
};

export default function UsernameForm({ onConnect }: Props) {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        // Validation
        const trimmedUsername = username.trim();

        if (!trimmedUsername) {
            setError("Username is required");
            return;
        }

        if (trimmedUsername.length < 3) {
            setError("Username must be at least 3 characters");
            return;
        }

        if (trimmedUsername.length > 20) {
            setError("Username must be less than 20 characters");
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
            setError("Only letters, numbers, and underscores allowed");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            await onConnect(trimmedUsername);
        } catch (err) {
            setError("Failed to connect. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="w-full max-w-md mx-4">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-12 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Welcome to Chat
                        </h1>
                        <p className="text-indigo-100 text-sm">
                            Enter a username to start chatting
                        </p>
                    </div>

                    {/* Form */}
                    <div className="px-8 py-8">
                        <div className="space-y-5">
                            {/* Username Input */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                    Choose a username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        placeholder="cool_user123"
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            setError(""); // Clear error on typing
                                        }}
                                        onKeyDown={handleKeyDown}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-offset-2
                      ${error
                                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                                : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                            }
                      placeholder-gray-400`}
                                        autoFocus
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="mt-2 flex items-center gap-2 text-red-600">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm">{error}</span>
                                    </div>
                                )}

                                {/* Character Count */}
                                {username.length > 0 && !error && (
                                    <p className="mt-1 text-xs text-gray-500">
                                        {username.length}/20 characters
                                    </p>
                                )}
                            </div>

                            {/* Connect Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl 
                  font-medium hover:from-indigo-700 hover:to-purple-700
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                  flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        Connect to Chat
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center mt-6 text-white/80 text-sm">
                    Connect with friends and start chatting instantly
                </p>
            </div>
        </div>
    );
}