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
    <main className="flex flex-col items-center justify-center h-screen bg-gray-500">
      {!currentUser ? (
        <UsernameForm onConnect={connectUser} />
      ) : (
        <div className="flex flex-col items-center justify-center h-screen-500 rounded-lg">
          <h2 className="text-2xl font-bold">Welcome {currentUser.username}</h2>
          <OnlineUsers
            users={onlineUsers.filter(
              (user) => user.id !== currentUser.id
            )}
            selectedUser={selectedUser}
            onSelect={selectUser}
          />
          {selectedUser && (
            <>
              <h2>
                Chat with {selectedUser.username}
              </h2>

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

              <ChatInput
                onSend={sendMessage}
              />
            </>
          )}
        </div>
      )}
    </main>
  );
}