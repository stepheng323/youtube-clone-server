import mongoose from 'mongoose';

const { Schema } = mongoose;
const videoSchema = Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  channel: { type: Schema.Types.ObjectId, ref: 'Channel' },
  viewsCount: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  duration: {
    type: String,
  },
  status: {
    type: String,
    default: 'draft',
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);

export default Video;
