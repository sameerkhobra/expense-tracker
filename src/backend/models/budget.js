import mongoose from 'mongoose';


const budgetSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  amount: { type: mongoose.Schema.Types.Decimal128, required: true },
  month: { type: Number, min: 1, max: 12 },
  year: { type: Number }
});

export default mongoose.model('Budget', budgetSchema);
