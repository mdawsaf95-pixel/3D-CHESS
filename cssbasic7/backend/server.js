const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// In-memory storage (replace with database in production)
const users = new Map();
const games = new Map();
const onlinePlayers = new Map();

// Routes
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');

app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);

// Socket.io Events
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    // Facebook Authentication
    socket.on('facebook_login', (data) => {
        const user = users.get(data.facebookId);
        
        if (user) {
            // Existing user
            socket.emit('facebook_login_success', {
                name: user.name,
                email: user.email,
                picture: user.picture,
                rating: user.rating,
                facebookId: data.facebookId
            });
        } else {
            // New user
            const newUser = {
                facebookId: data.facebookId,
                name: data.name,
                email: data.email,
                picture: data.picture,
                rating: 1200,
                gameHistory: []
            };
            users.set(data.facebookId, newUser);
            socket.emit('facebook_login_success', newUser);
        }

        onlinePlayers.set(socket.id, users.get(data.facebookId));
        io.emit('players_online', Array.from(onlinePlayers.values()));
    });

    socket.on('verify_facebook_token', (data) => {
        const user = users.get(data.facebookId);
        if (user) {
            socket.emit('facebook_login_success', {
                name: user.name,
                email: user.email,
                picture: user.picture,
                rating: user.rating,
                facebookId: data.facebookId
            });
            onlinePlayers.set(socket.id, user);
            io.emit('players_online', Array.from(onlinePlayers.values()));
        } else {
            socket.emit('facebook_login_failed', { error: 'User not found' });
        }
    });

    // Game Events
    socket.on('new_game', (data) => {
        const gameId = generateGameId();
        games.set(gameId, {
            id: gameId,
            player1: socket.id,
            player2: null,
            difficulty: data.difficulty,
            moves: [],
            status: 'waiting',
            createdAt: new Date()
        });
        socket.emit('game_created', { gameId });
    });

    socket.on('join_game', (data) => {
        const game = games.get(data.gameId);
        if (game && !game.player2) {
            game.player2 = socket.id;
            game.status = 'in_progress';
            socket.to(game.player1).emit('game_started', { gameId: data.gameId });
            socket.emit('game_started', { gameId: data.gameId });
        }
    });

    socket.on('make_move', (data) => {
        // Broadcast move to all connected clients
        socket.broadcast.emit('game_update', {
            move: data
        });
    });

    // Chat
    socket.on('chat_message', (data) => {
        const player = onlinePlayers.get(socket.id);
        io.emit('chat_message', {
            sender: player?.username || 'Anonymous',
            message: data.message,
            timestamp: new Date()
        });
    });

    // Players list
    socket.on('get_players_list', () => {
        socket.emit('players_online', Array.from(onlinePlayers.values()));
    });

    // Game history
    socket.on('get_game_history', () => {
        const player = onlinePlayers.get(socket.id);
        if (player) {
            socket.emit('game_history', player.gameHistory || []);
        }
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        onlinePlayers.delete(socket.id);
        io.emit('players_online', Array.from(onlinePlayers.values()));
    });
});

// Helper functions
function generateGameId() {
    return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
