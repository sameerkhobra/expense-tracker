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

app.get('/expenses-by-category', (req, res) => {
  const query = `
    SELECT 
      c.name AS category_name,
      SUM(t.amount) AS total_amount
    FROM Transactions t
    JOIN Categories c ON t.category_id = c.id
    WHERE t.type = 'expense'
    GROUP BY c.name;
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// GET /budgets
app.get('/budgets', (req, res) => {
  const query = `
    SELECT 
      b.id,
      b.category_id,
      c.name AS category_name,
      b.amount,
      b.month,
      b.year,
      COALESCE(SUM(t.amount), 0) AS spent
    FROM Budgets b
    JOIN Categories c ON b.category_id = c.id
    LEFT JOIN Transactions t 
      ON t.category_id = b.category_id 
      AND t.type = 'expense'
      AND EXTRACT(MONTH FROM t.date) = b.month
      AND EXTRACT(YEAR FROM t.date) = b.year
    GROUP BY b.id, c.name
    ORDER BY b.year DESC, b.month DESC, c.name;
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching budgets:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// POST /budgets
app.post('/budgets', (req, res) => {
  const { user_id = 1, category_id, amount, month, year } = req.body;
  if (!category_id || !amount || !month || !year) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO Budgets (user_id, category_id, amount, month, year)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  db.query(query, [user_id, category_id, amount, month, year], (err, result) => {
    if (err) {
      console.error('Error inserting budget:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(result.rows[0]);
  });
});

// PUT /budgets/:id
app.put('/budgets/:id', (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ error: 'Amount is required' });
  }

  const query = `
    UPDATE Budgets
    SET amount = $1
    WHERE id = $2
    RETURNING *;
  `;

  db.query(query, [amount, id], (err, result) => {
    if (err) {
      console.error('Error updating budget:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json(result.rows[0]);
  });
});

// GET /transactions?future_expenses=1
app.get('/transactions', (req, res) => {
  if (req.query.future_expenses === '1') {
    db.all(
      "SELECT * FROM Transactions WHERE date > CURRENT_DATE AND type = 'expense' ORDER BY date ASC",
      [],
      (err, rows) => {
        if (err) throw err;
        res.json(rows);
      }
    );
  } else {
    // your normal transactions query here
  }
});

// Get all wallets
app.get("/wallets", async (req, res) => {
  const result = await pool.query("SELECT * FROM Wallets");
  res.json(result.rows);
});

// Get all balances
app.get("/balances", async (req, res) => {
  const result = await pool.query("SELECT * FROM Balances");
  res.json(result.rows);
});

app.get("/transactions", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM Transactions ORDER BY date DESC"
  );
  res.json(result.rows);
});



// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
