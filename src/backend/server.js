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
  const query = `
    SELECT 
      t.id,
      t.amount,
      t.type,
      t.date,
      t.description,
      c.name AS category,
      w.name AS wallet_name
    FROM Transactions t
    LEFT JOIN Categories c ON t.category_id = c.id
    LEFT JOIN Wallets w ON t.wallet_id = w.id
    ORDER BY t.date DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


// ✅ Get all balances
app.get('/balances', (req, res) => {
  const query = `
    SELECT 
      b.id,
      b.user_id,
      b.wallet_id,
      w.name AS wallet_name,
      b.amount,
      b.currency,
      b.last_updated
    FROM Balances b
    JOIN Wallets w ON b.wallet_id = w.id
    ORDER BY b.amount DESC
    LIMIT 4;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


// ✅ Update a balance if needed
app.put('/balances/:id', (req, res) => {
  const { amount } = req.body;
  const { id } = req.params;

  db.query(
    'UPDATE Balances SET amount = ?, last_updated = CURRENT_TIMESTAMP WHERE id = ?',
    [amount, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Balance updated successfully' });
    }
  );
});


// ✅ POST a new transaction
app.post('/transactions', (req, res) => {
  const { amount, type, category_id, wallet_id, date, description } = req.body;

  // 1. Insert transaction
  const insertTx = `
    INSERT INTO Transactions (amount, type, category_id, wallet_id, date, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(insertTx, [amount, type, category_id, wallet_id, date, description], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to insert transaction' });
    }

    // 2. Update wallet balance
    const updateWallet = `
      UPDATE Balances
      SET amount = amount ${type === 'expense' ? '-' : '+'} ?
      WHERE wallet_id = ?
    `;

    db.query(updateWallet, [amount, wallet_id], (err2) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ error: 'Failed to update wallet balance' });
      }

      res.json({
        id: result.insertId,
        amount,
        type,
        category_id,
        wallet_id,
        date,
        description
      });
    });
  });
});


app.get('/wallets', (req, res) => {
  db.query('SELECT * FROM Wallets', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
