import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import type { ChatMessage, User } from '@cospace/shared';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Store connected users
const connectedUsers = new Map<string, User>();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining
  socket.on('user:join', (user: User) => {
    connectedUsers.set(socket.id, user);
    io.emit('users:update', Array.from(connectedUsers.values()));
  });

  // Handle user leaving
  socket.on('disconnect', () => {
    connectedUsers.delete(socket.id);
    io.emit('users:update', Array.from(connectedUsers.values()));
  });

  // Handle chat messages
  socket.on('chat:message', (message: ChatMessage) => {
    io.emit('chat:message', message);
  });

  // Handle user status updates
  socket.on('user:status', (user: User) => {
    connectedUsers.set(socket.id, user);
    io.emit('users:update', Array.from(connectedUsers.values()));
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 