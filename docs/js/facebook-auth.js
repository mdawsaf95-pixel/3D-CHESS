// Facebook Authentication Handler

// Initialize Facebook SDK
window.fbAsyncInit = function() {
    FB.init({
        appId: '2086903965228860',
        xfbml: true,
        version: 'v18.0'
    });

    // Check if user is already logged in
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            handleFBLogin();
        }
    });
};

// Handle Facebook Login
function handleFBLogin() {
    FB.login(function(response) {
        if (response.authResponse) {
            // Get user info
            FB.api('/me?fields=id,name,email,picture', function(userInfo) {
                // Send to backend for verification
                const socket = window.app.socket;
                socket.emit('facebook_login', {
                    facebookId: userInfo.id,
                    name: userInfo.name,
                    email: userInfo.email,
                    picture: userInfo.picture.data.url,
                    accessToken: response.authResponse.accessToken
                });

                // Store user info
                localStorage.setItem('user', JSON.stringify({
                    facebookId: userInfo.id,
                    name: userInfo.name,
                    email: userInfo.email,
                    picture: userInfo.picture.data.url
                }));

                // Show game interface
                window.app.showGameContainer();
            });
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {scope: 'public_profile,email'});
}

// Handle Facebook Logout
function handleFBLogout() {
    FB.logout(function() {
        localStorage.removeItem('user');
        window.app.showAuthContainer();
    });
}

// Check if user is logged in on page load
function checkFacebookLoginStatus() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        
        // Verify token with backend
        const socket = window.app.socket;
        socket.emit('verify_facebook_token', {
            facebookId: user.facebookId
        });
    }
}
