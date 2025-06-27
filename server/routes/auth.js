import express from 'express';
import passport from 'passport';

const router = express.Router();

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';
const CLIENT_URL = isProduction ? 'https://gitsignup.netlify.app' : 'http://localhost:5173';

// GitHub OAuth login
router.get('/github', passport.authenticate('github', {
  scope: ['repo', 'user:email']
}));

// GitHub OAuth callback
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: `${CLIENT_URL}/login?error=auth_failed` }),
  (req, res) => {
    // Successful authentication
    res.redirect(`${CLIENT_URL}/dashboard`);
  }
);

// Get current user
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

export default router;