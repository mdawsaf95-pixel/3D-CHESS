// Chess Game Logic
class ChessGame {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.gameHistory = [];
        this.selectedSquare = null;
        this.validMoves = [];
        this.castlingRights = {
            white: { kingside: true, queenside: true },
            black: { kingside: true, queenside: true }
        };
        this.enPassantSquare = null;
        this.halfmoveClock = 0;
        this.fullmoveNumber = 1;
    }

    initializeBoard() {
        // Standard chess starting position
        const board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // Set up pieces
        const pieces = {
            'r': 'rook', 'n': 'knight', 'b': 'bishop', 'q': 'queen', 'k': 'king', 'p': 'pawn'
        };

        // Black pieces (top)
        board[0] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'].map(p => ({ color: 'black', type: pieces[p] }));
        board[1] = Array(8).fill(null).map(() => ({ color: 'black', type: 'pawn' }));

        // White pieces (bottom)
        board[6] = Array(8).fill(null).map(() => ({ color: 'white', type: 'pawn' }));
        board[7] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'].map(p => ({ color: 'white', type: pieces[p] }));

        return board;
    }

    getValidMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece || piece.color !== this.currentPlayer) return [];

        const moves = [];
        const { type, color } = piece;

        switch (type) {
            case 'pawn':
                moves.push(...this.getPawnMoves(row, col, color));
                break;
            case 'rook':
                moves.push(...this.getSlidingMoves(row, col, [[0, 1], [1, 0], [0, -1], [-1, 0]]));
                break;
            case 'bishop':
                moves.push(...this.getSlidingMoves(row, col, [[1, 1], [1, -1], [-1, 1], [-1, -1]]));
                break;
            case 'queen':
                moves.push(...this.getSlidingMoves(row, col, [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]));
                break;
            case 'knight':
                moves.push(...this.getKnightMoves(row, col));
                break;
            case 'king':
                moves.push(...this.getKingMoves(row, col, color));
                break;
        }

        return moves;
    }

    getPawnMoves(row, col, color) {
        const moves = [];
        const direction = color === 'white' ? -1 : 1;
        const startRow = color === 'white' ? 6 : 1;

        // Forward move
        const newRow = row + direction;
        if (this.isValidSquare(newRow, col) && !this.board[newRow][col]) {
            moves.push([newRow, col]);

            // Two squares forward from start
            if (row === startRow && !this.board[row + 2 * direction][col]) {
                moves.push([row + 2 * direction, col]);
            }
        }

        // Captures
        [col - 1, col + 1].forEach(newCol => {
            if (this.isValidSquare(newRow, newCol) && this.board[newRow][newCol] && this.board[newRow][newCol].color !== color) {
                moves.push([newRow, newCol]);
            }
        });

        return moves;
    }

    getSlidingMoves(row, col, directions) {
        const moves = [];
        const piece = this.board[row][col];

        directions.forEach(([dr, dc]) => {
            for (let i = 1; i < 8; i++) {
                const newRow = row + i * dr;
                const newCol = col + i * dc;

                if (!this.isValidSquare(newRow, newCol)) break;

                const target = this.board[newRow][newCol];
                if (!target) {
                    moves.push([newRow, newCol]);
                } else if (target.color !== piece.color) {
                    moves.push([newRow, newCol]);
                    break;
                } else {
                    break;
                }
            }
        });

        return moves;
    }

    getKnightMoves(row, col) {
        const moves = [];
        const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
        const piece = this.board[row][col];

        knightMoves.forEach(([dr, dc]) => {
            const newRow = row + dr;
            const newCol = col + dc;

            if (this.isValidSquare(newRow, newCol)) {
                const target = this.board[newRow][newCol];
                if (!target || target.color !== piece.color) {
                    moves.push([newRow, newCol]);
                }
            }
        });

        return moves;
    }

    getKingMoves(row, col, color) {
        const moves = [];
        const piece = this.board[row][col];

        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;

                const newRow = row + dr;
                const newCol = col + dc;

                if (this.isValidSquare(newRow, newCol)) {
                    const target = this.board[newRow][newCol];
                    if (!target || target.color !== color) {
                        moves.push([newRow, newCol]);
                    }
                }
            }
        }

        // Castling
        if (color === 'white' && row === 7 && col === 4) {
            if (this.castlingRights.white.kingside && !this.board[7][5] && !this.board[7][6]) {
                moves.push([7, 6]);
            }
            if (this.castlingRights.white.queenside && !this.board[7][1] && !this.board[7][2] && !this.board[7][3]) {
                moves.push([7, 2]);
            }
        }

        return moves;
    }

    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        if (!piece) return false;

        // Store move in history
        this.gameHistory.push({
            from: [fromRow, fromCol],
            to: [toRow, toCol],
            piece: piece,
            captured: this.board[toRow][toCol]
        });

        // Move piece
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;

        // Update castling rights
        if (piece.type === 'king') {
            if (piece.color === 'white') {
                this.castlingRights.white = { kingside: false, queenside: false };
            } else {
                this.castlingRights.black = { kingside: false, queenside: false };
            }
        }

        // Switch player
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        return true;
    }

    isValidSquare(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    isCheckmate() {
        // Implement checkmate detection
        return false;
    }

    isStalemate() {
        // Implement stalemate detection
        return false;
    }

    getBoardState() {
        return this.board;
    }

    reset() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.gameHistory = [];
    }
}
