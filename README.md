# Realtime One-to-One Chat Application

A real-time one-to-one chat application built with **Next.js**, **Express.js**, **Node.js**, **TypeScript**, and **Socket.io**.

This project demonstrates the core architecture of a production-style real-time messaging system using an **in-memory store** instead of a database. It is designed as a learning project and serves as a foundation for adding MongoDB, authentication, and advanced chat features later.

---

# Tech Stack

## Frontend

* Next.js 15+
* React
* TypeScript
* Socket.io Client
* React Context API

## Backend

* Node.js
* Express.js
* TypeScript
* Socket.io

## Storage

* In-memory Maps (No database)

---

# Features

* Real-time WebSocket communication
* One-to-one private messaging
* Online users list
* User selection
* React Context for global socket state
* Socket.io event-driven architecture
* Automatic online/offline updates
* Clean separation between frontend and backend

---

# Project Structure

```text
realtime-chat/

├── frontend/
│
│   ├── src/
│   │
│   ├── app/
│   │
│   ├── components/
│   │   ├── ChatInput.tsx
│   │   ├── MessageList.tsx
│   │   ├── OnlineUsers.tsx
│   │   └── UsernameForm.tsx
│   │
│   ├── context/
│   │   └── SocketContext.tsx
│   │
│   ├── hooks/
│   │
│   ├── lib/
│   │   └── socket.ts
│   │
│   └── types/
│       ├── message.ts
│       └── user.ts
│
└── backend/
    ├── src/
    │
    ├── socket/
    │   └── index.ts
    │
    ├── store/
    │   └── memory.store.ts
    │
    └── app.ts
```

---

# Application Flow

```text
User Opens Application
        │
        ▼
Enter Username
        │
        ▼
Connect Button
        │
        ▼
socket.connect()
        │
        ▼
join-chat Event
        │
        ▼
Backend Stores User
        │
        ▼
Broadcast Online Users
        │
        ▼
Frontend Updates UI
        │
        ▼
Select User
        │
        ▼
Type Message
        │
        ▼
private-message Event
        │
        ▼
Backend Finds Receiver Socket
        │
        ▼
Message Delivered
        │
        ▼
Receiver UI Updates
```

---

# Architecture

```text
                 Frontend (Next.js)

                    React Components
                           │
                           ▼
                   SocketContext
                           │
                           ▼
                  Socket.io Client
                           │
═══════════════════════════════════════════
                  WebSocket Connection
═══════════════════════════════════════════
                           │
                  Socket.io Server
                           │
          ┌────────────────┼────────────────┐
          │                │                │
     User Storage     Socket Mapping   Message Routing
```

---

# Backend Data Structures

## Users Map

Maps a Socket ID to a connected user.

```text
socketId
   │
   ▼
User
```

Example

```text
abc123
   │
   ▼
{
    id: "user-1",
    username: "Asif",
    socketId: "abc123"
}
```

---

## User Socket Map

Maps a User ID to the current Socket ID.

```text
userId
   │
   ▼
socketId
```

Example

```text
user-1
   │
   ▼
abc123
```

This allows the server to instantly locate the receiver when sending a private message.

---

# Socket Events

## Client → Server

| Event             | Description               |
| ----------------- | ------------------------- |
| `join-chat`       | Register a connected user |
| `private-message` | Send a private message    |
| `disconnect`      | Remove disconnected user  |

---

## Server → Client

| Event             | Description                   |
| ----------------- | ----------------------------- |
| `online-users`    | Broadcast all connected users |
| `receive-message` | Deliver a private message     |

---

# Message Flow

```text
Sender

↓

ChatInput

↓

SocketContext.sendMessage()

↓

socket.emit("private-message")

↓

Socket.io Server

↓

Find receiver socket

↓

io.to(receiverSocketId)

↓

receive-message

↓

Receiver Updates UI
```

---

# Current Limitations

This project intentionally uses an in-memory store.

Therefore:

* Users are lost when the server restarts.
* Messages are not persisted.
* Offline users cannot receive messages.
* No authentication or authorization.
* No message history.
* No typing indicators.
* No read receipts.
* No file or image sharing.
* Single backend instance only.

---

# Future Improvements

* MongoDB integration
* Mongoose models
* JWT/Auth.js authentication
* Conversation model
* Message persistence
* Message history
* Typing indicators
* Read receipts
* Delivered status
* Last seen
* Online presence
* File uploads
* Image sharing
* Voice messages
* Redis adapter for horizontal scaling
* Multi-device support
* Message search
* Pagination
* Group chats

---

# Learning Outcomes

This project demonstrates:

* WebSocket fundamentals
* Socket.io client/server communication
* React Context architecture
* Event-driven programming
* One-to-one message routing
* Online presence management
* In-memory state management
* Separation of frontend and backend responsibilities
* Production-oriented chat architecture fundamentals

---

# Getting Started

## Backend

```bash
cd backend

npm install

npm run dev
```

Backend runs on:

```text
http://localhost:3000
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:3001
```

---

# License

This project is intended for educational purposes and can be extended into a production-ready real-time chat application by integrating authentication, persistent storage, and additional messaging features.
# Realtime One-to-One Chat Application

A real-time one-to-one chat application built with **Next.js**, **Express.js**, **Node.js**, **TypeScript**, and **Socket.io**.

This project demonstrates the core architecture of a production-style real-time messaging system using an **in-memory store** instead of a database. It is designed as a learning project and serves as a foundation for adding MongoDB, authentication, and advanced chat features later.

---

# Tech Stack

## Frontend

* Next.js 15+
* React
* TypeScript
* Socket.io Client
* React Context API

## Backend

* Node.js
* Express.js
* TypeScript
* Socket.io

## Storage

* In-memory Maps (No database)

---

# Features

* Real-time WebSocket communication
* One-to-one private messaging
* Online users list
* User selection
* React Context for global socket state
* Socket.io event-driven architecture
* Automatic online/offline updates
* Clean separation between frontend and backend

---

# Project Structure

```text
realtime-chat/

├── frontend/
│
│   ├── src/
│   │
│   ├── app/
│   │
│   ├── components/
│   │   ├── ChatInput.tsx
│   │   ├── MessageList.tsx
│   │   ├── OnlineUsers.tsx
│   │   └── UsernameForm.tsx
│   │
│   ├── context/
│   │   └── SocketContext.tsx
│   │
│   ├── hooks/
│   │
│   ├── lib/
│   │   └── socket.ts
│   │
│   └── types/
│       ├── message.ts
│       └── user.ts
│
└── backend/
    ├── src/
    │
    ├── socket/
    │   └── index.ts
    │
    ├── store/
    │   └── memory.store.ts
    │
    └── app.ts
```

---

# Application Flow

```text
User Opens Application
        │
        ▼
Enter Username
        │
        ▼
Connect Button
        │
        ▼
socket.connect()
        │
        ▼
join-chat Event
        │
        ▼
Backend Stores User
        │
        ▼
Broadcast Online Users
        │
        ▼
Frontend Updates UI
        │
        ▼
Select User
        │
        ▼
Type Message
        │
        ▼
private-message Event
        │
        ▼
Backend Finds Receiver Socket
        │
        ▼
Message Delivered
        │
        ▼
Receiver UI Updates
```

---

# Architecture

```text
                 Frontend (Next.js)

                    React Components
                           │
                           ▼
                   SocketContext
                           │
                           ▼
                  Socket.io Client
                           │
═══════════════════════════════════════════
                  WebSocket Connection
═══════════════════════════════════════════
                           │
                  Socket.io Server
                           │
          ┌────────────────┼────────────────┐
          │                │                │
     User Storage     Socket Mapping   Message Routing
```

---

# Backend Data Structures

## Users Map

Maps a Socket ID to a connected user.

```text
socketId
   │
   ▼
User
```

Example

```text
abc123
   │
   ▼
{
    id: "user-1",
    username: "Asif",
    socketId: "abc123"
}
```

---

## User Socket Map

Maps a User ID to the current Socket ID.

```text
userId
   │
   ▼
socketId
```

Example

```text
user-1
   │
   ▼
abc123
```

This allows the server to instantly locate the receiver when sending a private message.

---

# Socket Events

## Client → Server

| Event             | Description               |
| ----------------- | ------------------------- |
| `join-chat`       | Register a connected user |
| `private-message` | Send a private message    |
| `disconnect`      | Remove disconnected user  |

---

## Server → Client

| Event             | Description                   |
| ----------------- | ----------------------------- |
| `online-users`    | Broadcast all connected users |
| `receive-message` | Deliver a private message     |

---

# Message Flow

```text
Sender

↓

ChatInput

↓

SocketContext.sendMessage()

↓

socket.emit("private-message")

↓

Socket.io Server

↓

Find receiver socket

↓

io.to(receiverSocketId)

↓

receive-message

↓

Receiver Updates UI
```

---

# Current Limitations

This project intentionally uses an in-memory store.

Therefore:

* Users are lost when the server restarts.
* Messages are not persisted.
* Offline users cannot receive messages.
* No authentication or authorization.
* No message history.
* No typing indicators.
* No read receipts.
* No file or image sharing.
* Single backend instance only.

---

# Future Improvements

* MongoDB integration
* Mongoose models
* JWT/Auth.js authentication
* Conversation model
* Message persistence
* Message history
* Typing indicators
* Read receipts
* Delivered status
* Last seen
* Online presence
* File uploads
* Image sharing
* Voice messages
* Redis adapter for horizontal scaling
* Multi-device support
* Message search
* Pagination
* Group chats

---

# Learning Outcomes

This project demonstrates:

* WebSocket fundamentals
* Socket.io client/server communication
* React Context architecture
* Event-driven programming
* One-to-one message routing
* Online presence management
* In-memory state management
* Separation of frontend and backend responsibilities
* Production-oriented chat architecture fundamentals

---

# Getting Started

## Backend

```bash
cd backend

npm install

npm run dev
```

Backend runs on:

```text
http://localhost:3000
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:3001
```

---

# License

This project is intended for educational purposes and can be extended into a production-ready real-time chat application by integrating authentication, persistent storage, and additional messaging features.
