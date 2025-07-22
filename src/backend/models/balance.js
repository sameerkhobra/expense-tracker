import mongoose from 'mongoose';


const balanceSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  wallet_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true },
  amount: { type: mongoose.Schema.Types.Decimal128, default: 0.00 },
  currency: { type: String, default: 'INR' },
});

export default mongoose.model('Balance', balanceSchema);
