const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle joining a room
    socket.on('joinRoom', ({ username, room }) => {
        socket.join(room);
        console.log(`${username} joined room ${room}`);

        // Notify the room
        socket.to(room).emit('message', `${username} has joined the room.`);
    });

    // Handle incoming messages
    socket.on('chat message', ({ username, room, message }) => {
        io.to(room).emit('chat message', { username, message }); // Broadcast within the room
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
