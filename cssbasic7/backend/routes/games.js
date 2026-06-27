const express = require('express');
const router = express.Router();

// Create new game
router.post('/create', (req, res) => {
    const { difficulty } = req.body;

    const game = {
        id: generateGameId(),
        difficulty,
        players: [],
        moves: [],
        status: 'waiting',
        createdAt: new Date()
    };

    res.status(201).json(game);
});

// Get game by ID
router.get('/:gameId', (req, res) => {
    const { gameId } = req.params;
    
    // In production, query database
    res.json({
        id: gameId,
        players: [],
        moves: [],
        status: 'waiting'
    });
});

// Get all active games
router.get('/', (req, res) => {
    // In production, query database
    res.json([]);
});

// Update game
router.put('/:gameId', (req, res) => {
    const { gameId } = req.params;
    const { move } = req.body;

    // In production, update database and validate move
    res.json({ success: true, move });
});

// End game
router.post('/:gameId/end', (req, res) => {
    const { gameId } = req.params;
    const { result, reason } = req.body;

    // In production, update database
    res.json({ success: true, result });
});

// Helper function
function generateGameId() {
    return 'game_' + Date.now();
}

module.exports = router;
