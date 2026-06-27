// Game Model
class Game {
    constructor(player1Id, player2Id = null, difficulty = 'medium') {
        this.id = this.generateId();
        this.player1Id = player1Id;
        this.player2Id = player2Id;
        this.difficulty = difficulty;
        this.moves = [];
        this.status = player2Id ? 'in_progress' : 'waiting_for_opponent';
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.winner = null;
        this.reason = null;
    }

    generateId() {
        return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    initializeBoard() {
        const board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // Setup pieces (simplified representation)
        const pieces = {
            'r': 'rook', 'n': 'knight', 'b': 'bishop', 'q': 'queen', 'k': 'king', 'p': 'pawn'
        };

        // Black pieces
        board[0] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'].map(p => ({ color: 'black', type: pieces[p] }));
        board[1] = Array(8).fill(null).map(() => ({ color: 'black', type: 'pawn' }));

        // White pieces
        board[6] = Array(8).fill(null).map(() => ({ color: 'white', type: 'pawn' }));
        board[7] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'].map(p => ({ color: 'white', type: pieces[p] }));

        return board;
    }

    addMove(fromRow, fromCol, toRow, toCol) {
        this.moves.push({
            from: [fromRow, fromCol],
            to: [toRow, toCol],
            timestamp: new Date()
        });
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.updatedAt = new Date();
    }

    endGame(winner, reason) {
        this.status = 'completed';
        this.winner = winner;
        this.reason = reason;
        this.updatedAt = new Date();
    }

    joinGame(player2Id) {
        this.player2Id = player2Id;
        this.status = 'in_progress';
        this.updatedAt = new Date();
    }

    toJSON() {
        return {
            id: this.id,
            player1Id: this.player1Id,
            player2Id: this.player2Id,
            difficulty: this.difficulty,
            status: this.status,
            moves: this.moves,
            winner: this.winner,
            reason: this.reason,
            createdAt: this.createdAt
        };
    }
}

module.exports = Game;
