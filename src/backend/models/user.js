import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password_hash: { type: String, required: true }
});

export default mongoose.model('User', userSchema);
