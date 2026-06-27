# 3D Chess Game - Facebook Authentication

A real-time 3D chess game with Facebook login authentication, built with modern web technologies. Perfect for publishing on Facebook!

## Features

### Core Features
- **Facebook Login**: Easy authentication via Facebook
- **3D Chess Board**: Built with Three.js for immersive visual experience
- **Online Multiplayer**: Real-time gameplay using Socket.io
- **Standard Chess Rules**: Full implementation of chess rules including castling and en passant
- **Multiple Difficulty Levels**: Easy, Medium, and Hard AI opponents
- **User Profiles**: Player ratings and statistics pulled from Facebook
- **Game History**: Track all games played
- **In-game Chat**: Real-time communication with opponents

### Advanced Features
- **Player Rankings**: Rating system and leaderboards
- **Game Analysis**: Review past games
- **Facebook Profile Integration**: Automatic profile picture and name
- **Online Status**: See who's playing

## Project Structure

```
cssbasic7/
├── frontend/
│   ├── index.html                # Main HTML file with Facebook Login
│   ├── css/
│   │   └── style.css             # Game styling
│   └── js/
│       ├── app.js                # Main application controller
│       ├── chess-logic.js        # Chess game engine
│       ├── three-setup.js        # 3D board setup
│       ├── socket-client.js      # Real-time communication
│       └── facebook-auth.js      # Facebook authentication
└── backend/
    ├── server.js                 # Express server
    ├── package.json              # Dependencies
    ├── routes/
    │   ├── auth.js               # Facebook authentication routes
    │   └── games.js              # Game routes
    ├── models/
    │   ├── User.js               # User model (Facebook-based)
    │   └── Game.js               # Game model
    └── config/
        └── db.js                 # Configuration
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Facebook Developer Account
- Modern web browser

### Facebook App Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new App or use an existing one
3. Add Facebook Login product
4. Get your **App ID**
5. Configure your app domain and redirect URLs

### Frontend Setup

1. Update `facebook-auth.js` with your Facebook App ID:
```javascript
FB.init({
    appId: 'YOUR_APP_ID', // Replace with your Facebook App ID
    xfbml: true,
    version: 'v18.0'
});
```

2. Update `index.html` Facebook SDK script:
```html
<script async defer crossorigin="anonymous" 
    src="https://connect.facebook.net/en_US/sdk.js#xfb_ver=v18.0&app_id=YOUR_APP_ID&xfbml=1&version=v18.0&cookie=true">
</script>
```

3. No build process required! The frontend is ready to use.

4. If running locally:
   - Open `frontend/index.html` in your browser
   - Or serve with a simple HTTP server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```
PORT=3000
MONGO_URL=mongodb://localhost:27017/chess-game
JWT_SECRET=your_secret_key_here
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Running the Game

1. **Start Backend Server**:
   ```bash
   cd backend
   npm start
   ```

2. **Serve Frontend**:
   ```bash
   cd frontend
   # Use any HTTP server or open index.html directly
   ```

3. **Open in Browser**:
   - Navigate to `http://localhost:8000` (or your server's address)
   - Click "Login with Facebook"
   - Authorize the app
   - Start playing!

## Publishing on Facebook

### Steps to Publish:

1. **Create Facebook App**
   - Go to Facebook Developers Console
   - Create a new app (type: Consumer or Business)

2. **Configure App Settings**
   - Set App Domains
   - Add App Roles (Admin, Developers, Testers)
   - Configure Facebook Login OAuth Redirect URIs

3. **Host the Game**
   - Deploy frontend to a web server (Heroku, AWS, Netlify, etc.)
   - Deploy backend to a server (Heroku, AWS, DigitalOcean, etc.)
   - Ensure HTTPS is enabled

4. **Add as Facebook App**
   - Go to your Facebook page
   - Add the app as a tab or instant game
   - Or create a Canvas app pointing to your hosted URL

5. **Submit for Review**
   - Complete app review process
   - Get necessary permissions approved
   - Publish to your audience

## Technology Stack

### Frontend
- **Three.js**: 3D graphics and rendering
- **Socket.io-client**: Real-time communication
- **Facebook SDK**: Authentication and user data
- **HTML5/CSS3**: UI and styling
- **Vanilla JavaScript**: Game logic and controls

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Socket.io**: Real-time communication
- **MongoDB**: Database (optional, currently using in-memory storage)

## Game Controls

- **Click on squares**: Select and move pieces
- **New Game**: Start a fresh game
- **Resign**: Surrender the current game
- **Difficulty Level**: Choose AI difficulty (Easy/Medium/Hard)
- **Chat**: Communicate with opponents in real-time

## API Endpoints

### Authentication
- `POST /api/auth/facebook-login` - Facebook login
- `GET /api/auth/profile/:facebookId` - Get user profile
- `PUT /api/auth/rating/:facebookId` - Update user rating

### Games
- `POST /api/games/create` - Create new game
- `GET /api/games` - Get all active games
- `GET /api/games/:gameId` - Get game details
- `PUT /api/games/:gameId` - Update game
- `POST /api/games/:gameId/end` - End game

## Socket.io Events

### Client Events
- `facebook_login` - User Facebook login
- `verify_facebook_token` - Verify token
- `new_game` - Create new game
- `join_game` - Join existing game
- `make_move` - Make a chess move
- `chat_message` - Send chat message
- `get_players_list` - Get online players
- `get_game_history` - Get game history

### Server Events
- `facebook_login_success` / `facebook_login_failed` - Login response
- `players_online` - List of online players
- `game_update` - Game state update
- `chat_message` - Incoming chat message
- `game_created` - Game creation confirmation
- `game_started` - Game started notification

## Permissions Requested

The app requests the following Facebook permissions:
- `public_profile` - User's public profile information
- `email` - User's email address

## Future Enhancements

- [ ] Implement database persistence (MongoDB)
- [ ] Add AI opponent with minimax algorithm
- [ ] Add game time controls (Blitz, Rapid, Classical)
- [ ] Add achievements and badges
- [ ] Add spectator mode
- [ ] Add game replay functionality
- [ ] Mobile app version
- [ ] Tournament system
- [ ] Voice chat integration
- [ ] Share game results on Facebook timeline

## Troubleshooting

### Facebook Login not working?
- Check if App ID is correct
- Verify domain is added in Facebook App settings
- Check if HTTPS is enabled (required for production)
- Check browser console for errors

### Server connection issues?
- Ensure backend server is running
- Check if socket.io is properly configured
- Verify CORS settings
- Check firewall settings

### Game board not rendering?
- Check if Three.js is loaded
- Check browser console for WebGL errors
- Try a different browser (Chrome, Firefox recommended)

## Contributing

Feel free to fork this project and submit pull requests for any improvements!

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please create an issue in the repository.

---

**Happy Chess Playing! ♟️**
**Now with Facebook Login! 👥**
