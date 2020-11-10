import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  firstName: {
    type: String, required: true,
  },
  lastName: {
    type: String, required: true,
  },
  photo: {
    type: String,
  },
  password: {
    type: String, required: true,
  },
  refreshToken: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);

export default User;
