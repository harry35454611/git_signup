import express from 'express';
import axios from 'axios';

const router = express.Router();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

// Get user repositories
router.get('/repos', requireAuth, async (req, res) => {
  try {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        'Authorization': `token ${req.user.accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      params: {
        sort: 'updated',
        per_page: 100
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching repositories:', error.response?.data);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

// Get repository contents
router.get('/repos/:owner/:repo/contents', requireAuth, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { path = '' } = req.query;
    
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: {
        'Authorization': `token ${req.user.accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching contents:', error.response?.data);
    res.status(error.response?.status || 500).json({ error: 'Failed to fetch contents' });
  }
});

// Get file content
router.get('/repos/:owner/:repo/contents/:path(*)', requireAuth, async (req, res) => {
  try {
    const { owner, repo, path } = req.params;
    
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: {
        'Authorization': `token ${req.user.accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    // Decode base64 content for files
    if (response.data.type === 'file' && response.data.content) {
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      res.json({ ...response.data, decodedContent: content });
    } else {
      res.json(response.data);
    }
  } catch (error) {
    console.error('Error fetching file:', error.response?.data);
    res.status(error.response?.status || 500).json({ error: 'Failed to fetch file' });
  }
});

// Update file content
router.put('/repos/:owner/:repo/contents/:path(*)', requireAuth, async (req, res) => {
  try {
    const { owner, repo, path } = req.params;
    const { content, message, sha } = req.body;
    
    const encodedContent = Buffer.from(content, 'utf-8').toString('base64');
    
    const response = await axios.put(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      message: message || `Update ${path}`,
      content: encodedContent,
      sha: sha
    }, {
      headers: {
        'Authorization': `token ${req.user.accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error updating file:', error.response?.data);
    res.status(error.response?.status || 500).json({ error: 'Failed to update file' });
  }
});

// Create new file
router.post('/repos/:owner/:repo/contents/:path(*)', requireAuth, async (req, res) => {
  try {
    const { owner, repo, path } = req.params;
    const { content, message } = req.body;
    
    const encodedContent = Buffer.from(content, 'utf-8').toString('base64');
    
    const response = await axios.put(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      message: message || `Create ${path}`,
      content: encodedContent
    }, {
      headers: {
        'Authorization': `token ${req.user.accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error creating file:', error.response?.data);
    res.status(error.response?.status || 500).json({ error: 'Failed to create file' });
  }
});

export default router;