// Socket.io Client for Real-time Communication
class SocketClient {
    constructor(serverUrl = 'http://localhost:3000') {
        this.socket = io(serverUrl);
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Connection events
        this.socket.on('connect', () => {
            console.log('Connected to server');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        // Authentication events
        this.socket.on('facebook_login_success', (data) => {
            if (window.app) {
                window.app.currentUser = data;
                window.app.showGameContainer();
            }
        });

        // Game events
        this.socket.on('game_update', (data) => {
            if (window.app) {
                window.app.onGameUpdate(data);
            }
        });

        this.socket.on('players_online', (data) => {
            if (window.app) {
                window.app.updateOnlinePlayers(data);
            }
        });

        this.socket.on('chat_message', (data) => {
            if (window.app) {
                window.app.addChatMessage(data);
            }
        });

        this.socket.on('player_joined', (data) => {
            if (window.app) {
                window.app.onPlayerJoined(data);
            }
        });

        this.socket.on('player_left', (data) => {
            if (window.app) {
                window.app.onPlayerLeft(data);
            }
        });
    }

    // Emit events
    facebookLogin(facebookId, name, email, picture, accessToken) {
        this.socket.emit('facebook_login', { facebookId, name, email, picture, accessToken });
    }

    verifyFacebookToken(facebookId) {
        this.socket.emit('verify_facebook_token', { facebookId });
    }

    logout() {
        this.socket.emit('logout');
    }

    startNewGame(difficulty = 'medium') {
        this.socket.emit('new_game', { difficulty });
    }

    makeMove(from, to) {
        this.socket.emit('make_move', { from, to });
    }

    sendChatMessage(message) {
        this.socket.emit('chat_message', { message });
    }

    joinGame(gameId) {
        this.socket.emit('join_game', { gameId });
    }

    resignGame() {
        this.socket.emit('resign_game');
    }

    getPlayersList() {
        this.socket.emit('get_players_list');
    }

    getGameHistory() {
        this.socket.emit('get_game_history');
    }
}
