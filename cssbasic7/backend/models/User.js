// User Model
class User {
    constructor(facebookId, name, email, picture) {
        this.facebookId = facebookId;
        this.name = name;
        this.email = email;
        this.picture = picture;
        this.rating = 1200;
        this.gameHistory = [];
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    addGameToHistory(game) {
        this.gameHistory.push(game);
        this.updatedAt = new Date();
    }

    updateRating(newRating) {
        this.rating = newRating;
        this.updatedAt = new Date();
    }

    toJSON() {
        return {
            facebookId: this.facebookId,
            name: this.name,
            email: this.email,
            picture: this.picture,
            rating: this.rating,
            gamesPlayed: this.gameHistory.length,
            createdAt: this.createdAt
        };
    }
}

module.exports = User;
