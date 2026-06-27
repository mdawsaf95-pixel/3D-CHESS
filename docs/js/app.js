// Main Application Controller
class ChessApp {
    constructor() {
        this.game = new ChessGame();
        this.board3d = null;
        this.socket = new SocketClient();
        this.currentUser = null;
        this.setupEventListeners();
        this.checkLoginStatus();
        
        window.app = this;
    }

    setupEventListeners() {
        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => this.handleLogout());

        // Game Controls
        document.getElementById('new-game-btn').addEventListener('click', () => this.startNewGame());
        document.getElementById('resign-btn').addEventListener('click', () => this.resignGame());

        // Chat
        document.getElementById('send-chat-btn').addEventListener('click', () => this.sendChatMessage());
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });

        // Socket events
        this.socket.socket.on('facebook_login_success', (data) => {
            this.currentUser = data;
            document.getElementById('player-name').textContent = data.name;
            document.getElementById('player-rating').textContent = `Rating: ${data.rating || 1200}`;
            document.getElementById('player-avatar').src = data.picture;
            this.showGameContainer();
        });

        this.socket.socket.on('facebook_login_failed', (data) => {
            alert('Failed to login: ' + data.error);
        });
    }

    checkLoginStatus() {
        checkFacebookLoginStatus();
    }

    handleLogout() {
        handleFBLogout();
        this.socket.logout();
    }

    showGameContainer() {
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('game-container').style.display = 'flex';

        if (!this.board3d) {
            this.board3d = new Chess3DBoard('chess-board');
        }

        this.socket.getPlayersList();
        this.socket.getGameHistory();
    }

    showAuthContainer() {
        document.getElementById('auth-container').style.display = 'flex';
        document.getElementById('game-container').style.display = 'none';
    }

    startNewGame() {
        const difficulty = document.getElementById('difficulty-level').value;
        this.socket.startNewGame(difficulty);
        this.game.reset();
    }

    resignGame() {
        this.socket.resignGame();
    }

    sendChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();

        if (message) {
            this.socket.sendChatMessage(message);
            input.value = '';
        }
    }

    addChatMessage(data) {
        const chatBox = document.getElementById('chat-messages');
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message';
        messageEl.innerHTML = `<span class="sender">${data.sender}:</span> ${data.message}`;
        chatBox.appendChild(messageEl);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    updateOnlinePlayers(players) {
        const playersList = document.getElementById('players-online');
        playersList.innerHTML = '';

        players.forEach(player => {
            const li = document.createElement('li');
            li.textContent = `${player.username} (${player.rating})`;
            li.addEventListener('click', () => this.invitePlayer(player.id));
            playersList.appendChild(li);
        });
    }

    updateGameHistory(games) {
        const historyList = document.getElementById('game-history');
        historyList.innerHTML = '';

        games.forEach(game => {
            const li = document.createElement('li');
            li.textContent = `${game.opponent} - ${game.result}`;
            historyList.appendChild(li);
        });
    }

    onGameUpdate(data) {
        if (data.move) {
            const { from, to } = data.move;
            this.game.makeMove(from[0], from[1], to[0], to[1]);
            this.board3d.movePiece(from[0], from[1], to[0], to[1]);
        }
    }

    onPlayerJoined(data) {
        console.log(`${data.username} joined`);
    }

    onPlayerLeft(data) {
        console.log(`${data.username} left`);
    }

    invitePlayer(playerId) {
        this.socket.emit('invite_player', { playerId });
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ChessApp();
});
