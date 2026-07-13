"use client";

import UsernameForm from "@/components/UsernameForm";
import { useSocketContext } from "@/context/SocketContext";
import OnlineUsers from "@/components/OnlineUsers";
import ChatInput from "@/components/ChatInput";
import MessageList from "@/components/MessageList";

export default function Home() {
  const {
    currentUser,
    connectUser,
    onlineUsers,
    selectedUser,
    selectUser,
    messages,
    sendMessage,
  } = useSocketContext();

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      {!currentUser ? (
        <div className="w-full max-w-md">
          <UsernameForm onConnect={connectUser} />
        </div>
      ) : (
        <div className="w-full max-w-6xl h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4">
            <h2 className="text-xl font-bold">
              Welcome, {currentUser.username}
            </h2>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar - Online Users */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
              <OnlineUsers
                users={onlineUsers.filter(
                  (user) => user.id !== currentUser.id
                )}
                selectedUser={selectedUser}
                onSelect={selectUser}
              />
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
              {selectedUser ? (
                <>
                  {/* Chat Header */}
                  <div className="px-6 py-3 border-b border-gray-200 bg-white">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Chat with {selectedUser.username}
                    </h2>
                    <span className="text-sm text-green-500">● Online</span>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto">
                    <MessageList
                      messages={messages.filter(
                        (msg) =>
                          (msg.senderId === currentUser.id &&
                            msg.receiverId === selectedUser.id) ||
                          (msg.senderId === selectedUser.id &&
                            msg.receiverId === currentUser.id)
                      )}
                      currentUserId={currentUser.id}
                    />
                  </div>

                  {/* Chat Input */}
                  <div className="border-t border-gray-200 p-4 bg-white">
                    <ChatInput onSend={sendMessage} />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="mt-2">Select a user to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}