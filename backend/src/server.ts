import http from "http";
import { initializeSocket } from "./socket/index.js";

import app from "./app.js";
import { Server } from "socket.io";
import userRoutes from "./routes/user.routes.js";
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use("/api/users", userRoutes);

initializeSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});