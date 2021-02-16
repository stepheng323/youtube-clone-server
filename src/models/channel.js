import mongoose from 'mongoose';

const { Schema } = mongoose;

const channelSchema = Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  subscriberCount: {
    type: Number,
    default: 0,
  },
  channelAvatar: {
    type: String,
  },
  videos: [{ type: Schema.Types.ObjectId, ref: 'Video' }],

  channelDescription: {
    type: String,
  },
}, { timestamps: true });

const Channel = mongoose.model('Channel', channelSchema);

export default Channel;
