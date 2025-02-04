const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const pool = require('./config/database');
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://your-frontend-url.render.com',
    methods: ['GET', 'POST'],
    credentials: true
  }));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error connecting to the database', err);
    } else {
      console.log('Database connected successfully');
    }
  });

// Function to calculate cosine similarity
function cosineSimilarity(vec1, vec2) {
    const dotProduct = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));
    return dotProduct / (magnitude1 * magnitude2);
  }
  
  // API endpoint to save user interests
  app.post('/api/users', async (req, res) => {
    const { interests } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO users (interests) VALUES ($1) RETURNING id',
        [interests]
      );
      res.json({ id: result.rows[0].id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // API endpoint to find matches
  app.get('/api/matches/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      // Get current user's interests
      const userResult = await pool.query(
        'SELECT interests FROM users WHERE id = $1',
        [userId]
      );
      const userInterests = userResult.rows[0].interests;
  
      // Get all other users
      const othersResult = await pool.query(
        'SELECT id, interests FROM users WHERE id != $1',
        [userId]
      );
  
      // Calculate similarity scores
      const matches = othersResult.rows.map(other => ({
        id: other.id,
        similarity: cosineSimilarity(userInterests, other.interests)
      }));
  
      // Sort by similarity and return top matches
      const topMatches = matches
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);
  
      res.json(topMatches);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  