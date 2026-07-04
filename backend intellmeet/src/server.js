const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// CORS Config Vercel deployments ke liye ready hai
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

const mockUsers = [
    { id: '1', name: 'Zidio Member', email: 'name@zidio.com', password: 'password123', role: 'Member' }
];

app.get('/', (req, res) => {
    res.send('IntellMeet Socket Core Server Live');
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
        return res.status(200).json({
            success: true,
            token: "secure-jwt-token-xyz123",
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    }
    return res.status(401).json({ success: false, message: "Invalid credentials" });
});

// ⚡ WebRTC WebSocket Signaling Engine
io.on('connection', (socket) => {
    console.log(`🔌 New engineer node mesh active: ${socket.id}`);

    socket.on('join-room', ({ roomCode, userId }) => {
        socket.join(roomCode);
        console.log(`🏠 User ${userId} attached to room: ${roomCode}`);

        // Doosre user ko notify karna ki naya peer aa gaya hai
        socket.to(roomCode).emit('peer-joined', { userId: socket.id });
    });

    // WebRTC SDP Handshake Signals exchange endpoints
    socket.on('signal', ({ to, signal }) => {
        io.to(to).emit('signal', { from: socket.id, signal });
    });

    socket.on('disconnect', () => {
        console.log(`❌ Node disconnected: ${socket.id}`);
        io.emit('peer-left', { userId: socket.id });
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Enterprise Matrix Server on http://localhost:${PORT}`);
});