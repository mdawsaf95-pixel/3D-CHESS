// Environment Configuration
module.exports = {
    development: {
        port: process.env.PORT || 3000,
        mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/chess-game',
        jwtSecret: process.env.JWT_SECRET || 'your_secret_key_here',
        nodeEnv: 'development'
    },
    production: {
        port: process.env.PORT || 3000,
        mongoUrl: process.env.MONGO_URL,
        jwtSecret: process.env.JWT_SECRET,
        nodeEnv: 'production'
    }
};
