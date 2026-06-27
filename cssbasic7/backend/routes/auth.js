const express = require('express');
const router = express.Router();

// User Model (simplified)
class User {
    constructor(facebookId, name, email, picture) {
        this.facebookId = facebookId;
        this.name = name;
        this.email = email;
        this.picture = picture;
        this.rating = 1200;
        this.gameHistory = [];
        this.createdAt = new Date();
    }
}

// Facebook login endpoint
router.post('/facebook-login', (req, res) => {
    const { facebookId, name, email, picture, accessToken } = req.body;
    
    // Validate input
    if (!facebookId || !name || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // In production, verify token with Facebook servers
    // For now, we'll just accept it
    
    // Create user object
    const user = {
        facebookId,
        name,
        email,
        picture,
        rating: 1200,
        createdAt: new Date()
    };

    // Generate JWT token
    const token = 'jwt_token_here'; // In production, generate real JWT

    res.json({ 
        success: true, 
        token, 
        user 
    });
});

// Get user profile
router.get('/profile/:facebookId', (req, res) => {
    const { facebookId } = req.params;
    // In production, query database
    res.json({ name: 'User', rating: 1200, gamesPlayed: 0 });
});

// Update rating
router.put('/rating/:facebookId', (req, res) => {
    const { ratingChange } = req.body;
    // In production, update database
    res.json({ newRating: 1250 });
});

module.exports = router;
