import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Create DB connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'exp_tracker',
  port: process.env.DB_PORT || 3306,
});

console.log('Connecting with:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    throw err;
  }
  console.log('✅ Connected to MySQL!');
});

// ✅ GET all categories
app.get('/categories', (req, res) => {
  console.log("Received request to /categories"); // <-- add this!

  db.query('SELECT * FROM Categories', (err, results) => {
    if (err) {
      console.error("DB query error:", err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log("Results:", results); // <-- add this too!
    res.json(results);
  });
});


// ✅ GET all transactions
app.get('/transactions', (req, res) => {
  db.query(
    `SELECT t.id, t.amount, t.type, t.date, t.description, 
            c.name as category 
     FROM transactions t 
     LEFT JOIN Categories c ON t.category_id = c.id`,
    (err, results) => {
      if (err) {
        console.error('Error fetching transactions:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    }
  );
});

// ✅ POST a new transaction
app.post('/transactions', (req, res) => {
  const { amount, type, category_id, date, description } = req.body;

  if (!amount || !type || !category_id || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `
    INSERT INTO transactions (amount, type, category_id, date, description)
    VALUES (?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [amount, type, category_id, date, description],
    (err, result) => {
      if (err) {
        console.error('Error inserting transaction:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
