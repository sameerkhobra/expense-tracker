import mongoose from 'mongoose';


const walletSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }
});

export default mongoose.model('Wallet', walletSchema);
