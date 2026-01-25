import { createServer } from "node:http";
import { parse } from "node:url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// In-memory data store
const users = new Map(); // socketId -> userId
const messages = new Map(); // chatId -> Message[]
const chats = new Map(); // chatId -> Chat

// Initialize some dummy chats
const dummyChats = [
    {
        id: "chat-1",
        type: "personal",
        members: ["user-1", "user-2"],
        messages: []
    }
];

dummyChats.forEach(chat => {
    chats.set(chat.id, chat);
    messages.set(chat.id, []);
});

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    const { pathname, query } = parsedUrl;

    // Custom API routes for direct shared memory access
    if (pathname === '/api/direct/chats') {
        const userId = query.userId as string;
        if (!userId) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Missing userId" }));
            return;
        }
        
        const userChats = [];
        for (const chat of chats.values()) {
            if (chat.members.includes(userId)) {
                userChats.push(chat);
            }
        }
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(userChats));
        return;
    }

    if (pathname === '/api/direct/messages') {
        const chatId = query.chatId as string;
        if (!chatId) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Missing chatId" }));
            return;
        }

        const chatMessages = messages.get(chatId) || [];
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(chatMessages));
        return;
    }

    handler(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
        origin: "*", // Adjust in production
        methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join a specific user room
    socket.on("join-user", (userId) => {
        users.set(socket.id, userId);
        socket.join(userId);
        console.log(`Socket ${socket.id} joined user room ${userId}`);
    });

    // Join a chat room
    socket.on("join-chat", (chatId) => {
        socket.join(chatId);
        console.log(`Socket ${socket.id} joined chat ${chatId}`);
    });

    // Create a new chat
    socket.on("create-chat", ({ partnerId, currentUserId }) => {
        // Check if chat already exists
        let existingChatId = null;
        for (const [id, chat] of chats.entries()) {
            if (chat.type === 'personal' && 
                chat.members.includes(partnerId) && 
                chat.members.includes(currentUserId)) {
                existingChatId = id;
                break;
            }
        }

        if (existingChatId) {
            socket.emit("chat-created", chats.get(existingChatId));
            return;
        }

        const newChatId = `chat-${Date.now()}`;
        const newChat = {
            id: newChatId,
            type: "personal",
            members: [currentUserId, partnerId],
            messages: [],
            lastMessage: "",
            lastMessageTime: new Date(),
            unreadCount: 0
        };

        chats.set(newChatId, newChat);
        messages.set(newChatId, []);

        // Notify both users
        // We need to find the socket ID for the partner
        // iterating users map (socketId -> userId)
        for (const [socketId, userId] of users.entries()) {
            if (userId === partnerId || userId === currentUserId) {
                io.to(socketId).emit("chat-created", newChat);
            }
        }
    });

    // Create a new group chat
    socket.on("create-group", ({ name, memberIds, adminId }) => {
        const newChatId = `group-${Date.now()}`;
        const newChat = {
            id: newChatId,
            type: "group",
            name,
            members: [...memberIds, adminId],
            adminIds: [adminId],
            messages: [],
            lastMessage: "Group created",
            lastMessageTime: new Date(),
            unreadCount: 0
        };

        chats.set(newChatId, newChat);
        messages.set(newChatId, []);

        // Notify all members
        // Iterate users map to find socket IDs
        for (const [socketId, userId] of users.entries()) {
            if (newChat.members.includes(userId)) {
                io.to(socketId).emit("chat-created", newChat);
            }
        }
    });

    socket.on("send-message", ({ chatId, content, senderId, senderName }) => {
        const newMessage = {
            id: Date.now().toString(),
            content,
            senderId,
            senderName,
            timestamp: new Date(),
            type: "message",
            chatId
        };

        // Store message
        if (!messages.has(chatId)) {
            messages.set(chatId, []);
        }
        messages.get(chatId).push(newMessage);

        // Broadcast to chat room
        io.to(chatId).emit("message", newMessage);
        
        // Notify members (for chat list updates)
        const chat = chats.get(chatId);
        if (chat) {
             chat.members.forEach((memberId: string) => {
                 io.to(memberId).emit("chat-updated", {
                     ...chat,
                     lastMessage: content,
                     lastMessageTime: newMessage.timestamp,
                     unreadCount: 1 // Simplified logic
                 });
             });
        }
    });

    socket.on("disconnect", () => {
        users.delete(socket.id);
        console.log("User disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
