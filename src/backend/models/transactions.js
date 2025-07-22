import mongoose from 'mongoose';


const transactionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  wallet_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', default: null },
  amount: { type: mongoose.Schema.Types.Decimal128, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  date: { type: Date, required: true },
  description: { type: String },
  wallet_type: { type: String }
});

export default mongoose.model('Transaction', transactionSchema);
