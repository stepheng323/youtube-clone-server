import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = Schema({
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
  avatar: {
    type: String,
  },
  password: {
    type: String, required: true,
  },
  channel: [{ type: Schema.Types.ObjectId, ref: 'Channel' }],

  refreshToken: {
    type: String,
  },
  date: {
    type: Date, default: Date.now
  },
});

const User = mongoose.model('User', userSchema);

export default User;
