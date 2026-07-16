"use client";

import UsernameForm from "@/components/UsernameForm";
import { useSocketContext } from "@/context/SocketContext";
import OnlineUsers from "@/components/ConversationList";
import ChatInput from "@/components/ChatInput";
import MessageList from "@/components/MessageList";
import TypingIndicator from "@/components/TypingIndicator";
import ConversationList from "@/components/ConversationList";
import { useState } from "react";
import { Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { Typography } from 'antd'
import { List } from 'antd'

export default function Home() {
  const {
    currentUser,
    connectUser,
    onlineUsers,
    selectedUser,
    selectUser,
    messages,
    sendMessage,
    typingUser,
    conversations,
    logout,
    users,
  } = useSocketContext();

  const [open, setOpen] = useState(false);

  if (currentUser === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
          <span className="text-lg font-medium text-gray-700">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (currentUser === null) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="w-full max-w-md flex items-center justify-center">
          <UsernameForm onConnect={connectUser} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
        <div className="w-full h-[100vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              Welcome, {currentUser.username}
            </h2>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-indigo-100 px-4 py-2 rounded-lg shadow-sm border border-indigo-200">
                <span className="text-[0.97rem] font-semibold uppercase tracking-wider text-indigo-700 mr-3">
                  New Chats
                </span>
                <button
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150 text-white shadow-md"
                  onClick={() => setOpen(true)}
                  aria-label="Start New Chat"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white border border-indigo-200 text-indigo-700 font-semibold hover:bg-indigo-600 hover:text-white transition-colors duration-150 shadow-sm"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                </svg>
                Logout
              </button>
            </div>

          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar - Online Users */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
              <ConversationList
                onlineUsers={onlineUsers.filter(
                  (user) => user._id !== currentUser._id,
                )}
                conversations={conversations}
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
                    <span className="text-sm text-green-500">
                      ● Online
                    </span>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto">
                    <MessageList
                      messages={messages}
                      currentUserId={currentUser._id}
                    />
                  </div>

                  {/* Add after MessageList */}
                  {typingUser &&
                    typingUser._id ===
                    selectedUser?._id && (
                      <TypingIndicator
                        username={selectedUser.username}
                      />
                    )}

                  {/* Chat Input */}
                  <div className="border-t border-gray-200 p-4 bg-white">
                    <ChatInput onSend={sendMessage} />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p className="mt-2">
                      Select a user to start chatting
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Start New Chat"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <div style={{ maxHeight: 350, overflowY: 'auto' }}>
          <List
            itemLayout="horizontal"
            dataSource={users}
            renderItem={user => (
              <List.Item
                style={{
                  cursor: 'pointer',
                  padding: '12px 16px',
                  borderRadius: 7,
                  transition: 'background 0.2s',
                  marginBottom: 6
                }}
                onClick={() => {
                  selectUser(user);
                  setOpen(false);
                }}
                className="hover:bg-gray-100"
              >
                <List.Item.Meta
                  avatar={
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full text-white text-lg font-semibold">
                      {user.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  }
                  title={
                    <span className="font-medium text-base">
                      {user.username.charAt(0).toUpperCase() +
                        user.username.slice(1).toLowerCase()}
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </Modal>
    </>
  );
}
