import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import models from './models/index.js'; // make sure models are correctly defined

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config(); // Make sure this is before using process.env
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI is not defined in the environment variables.");
  process.exit(1);
}

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Successfully connected to MongoDB");
})
.catch((error) => {
  console.error("❌ MongoDB connection error:", error.message);
  process.exit(1);
});

// ✅ GET all categories
app.get('/categories', async (req, res) => {
  try {
    const categories = await models.Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ GET all transactions
app.get('/transactions', async (req, res) => {
  try {
    if (req.query.future_expenses === '1') {
      const futureExpenses = await models.Transaction.find({
        type: 'expense',
        date: { $gt: new Date() }
      }).sort({ date: 1 });
      return res.json(futureExpenses);
    }

    const transactions = await models.Transaction
      .find()
      .populate('category_id', 'name')
      .populate('wallet_id', 'name')
      .sort({ date: -1 });

    const formatted = transactions.map(t => ({
      id: t._id,
      amount: t.amount,
      type: t.type,
      date: t.date,
      description: t.description,
      category: t.category_id?.name || null,
      wallet_name: t.wallet_id?.name || null
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ POST a new transaction and update balance
app.post('/transactions', async (req, res) => {
  const { amount, type, category_id, wallet_id, date, description } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newTx = await models.Transaction.create([{
      amount,
      type,
      category_id,
      wallet_id,
      date,
      description
    }], { session });

    const operator = type === 'expense' ? -1 : 1;

    const balance = await models.Balance.findOneAndUpdate(
      { wallet_id },
      {
        $inc: { amount: operator * parseFloat(amount) },
        last_updated: new Date()
      },
      { new: true, session }
    );

    if (!balance) {
      throw new Error('Wallet balance not found');
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(newTx[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ error: 'Transaction failed' });
  }
});

// ✅ GET all wallets
app.get('/wallets', async (req, res) => {
  try {
    const wallets = await models.Wallet.find();
    res.json(wallets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ GET all balances (Top 4 by amount)
app.get('/balances', async (req, res) => {
  try {
    const balances = await models.Balance.find()
      .populate('wallet_id', 'name')
      .sort({ amount: -1 })
      .limit(4);

    const formatted = balances.map(b => ({
      id: b._id,
      user_id: b.user_id,
      wallet_id: b.wallet_id?._id || null,
      wallet_name: b.wallet_id?.name || null,
      amount: b.amount,
      currency: b.currency,
      last_updated: b.last_updated
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ PUT update a balance
app.put('/balances/:id', async (req, res) => {
  try {
    const updated = await models.Balance.findByIdAndUpdate(
      req.params.id,
      {
        amount: req.body.amount,
        last_updated: new Date()
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Balance not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ GET expenses-by-category
app.get('/expenses-by-category', async (req, res) => {
  try {
    const results = await models.Transaction.aggregate([
      { $match: { type: 'expense' } },
      {
        $group: {
          _id: '$category_id',
          total_amount: { $sum: { $toDouble: '$amount' } }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          category_name: '$category.name',
          total_amount: 1
        }
      }
    ]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ GET budgets
app.get('/budgets', async (req, res) => {
  try {
    const results = await models.Budget.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $lookup: {
          from: 'transactions',
          let: { catId: '$category_id', m: '$month', y: '$year' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$category_id', '$$catId'] },
                    { $eq: ['$type', 'expense'] },
                    { $eq: [{ $month: '$date' }, '$$m'] },
                    { $eq: [{ $year: '$date' }, '$$y'] }
                  ]
                }
              }
            }
          ],
          as: 'matchedTransactions'
        }
      },
      {
        $addFields: {
          spent: {
            $sum: {
              $map: {
                input: '$matchedTransactions',
                as: 'tx',
                in: { $toDouble: '$$tx.amount' }
              }
            }
          }
        }
      },
      {
        $project: {
          id: '$_id',
          category_name: '$category.name',
          category_id: 1,
          amount: 1,
          month: 1,
          year: 1,
          spent: { $ifNull: ['$spent', 0] }
        }
      },
      { $sort: { year: -1, month: -1, category_name: 1 } }
    ]);
    res.json(results);
  } catch (err) {
    console.error('Error fetching budgets:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ POST new budget
app.post('/budgets', async (req, res) => {
  try {
    const { user_id = 1, category_id, amount, month, year } = req.body;

    if (!category_id || !amount || !month || !year) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newBudget = await models.Budget.create({
      user_id,
      category_id,
      amount,
      month,
      year
    });

    res.json(newBudget);
  } catch (err) {
    console.error('Error inserting budget:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ PUT update budget
app.put('/budgets/:id', async (req, res) => {
  try {
    const { amount } = req.body;

    const updated = await models.Budget.findByIdAndUpdate(
      req.params.id,
      { amount },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Budget not found' });

    res.json(updated);
  } catch (err) {
    console.error('Error updating budget:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
