import mongoose from 'mongoose';

const { Schema } = mongoose;

const subscriberSchema = Schema({
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

}, { timestamps: true });

const Subscriber = mongoose.model('Subcriber', subscriberSchema);

export default Subscriber;
