import mongoose from 'mongoose';

const { Schema } = mongoose;

const historySchema = Schema({
  video: { type: Schema.Types.ObjectId, ref: 'Video' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true });

const History = mongoose.model('History', historySchema);

export default History;
