// Authentication Check - Redirect to login if no token
// This script must be loaded AFTER BaseURL.js

(function() {
  // Check if token exists
  if (!token || token === null || token === 'null' || token === '') {
    console.log('No valid token found. Redirecting to login...');
    
    // Determine the correct path to index.html based on current location
    const currentPath = window.location.pathname;
    const isInPagesFolder = currentPath.includes('/pages/');
    
    // Redirect to login
    if (isInPagesFolder) {
      window.location.href = '../index.html';
    } else {
      window.location.href = '/index.html';
    }
    
    // Stop execution
    return;
  }

  // Optional: Verify token with server (can be enabled if needed)
  // This will make a quick call to check if token is still valid
  function verifyToken() {
    fetch(baseUrl + "/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      if (!res.ok) {
        // Token is invalid or expired
        console.log('Token is invalid or expired. Redirecting to login...');
        localStorage.removeItem('token');
        
        const currentPath = window.location.pathname;
        const isInPagesFolder = currentPath.includes('/pages/');
        
        if (isInPagesFolder) {
          window.location.href = '../index.html';
        } else {
          window.location.href = '/index.html';
        }
      }
    })
    .catch((err) => {
      console.error('Token verification failed:', err);
    });
  }

  // Uncomment the line below to enable server-side token verification
  // verifyToken();
})();