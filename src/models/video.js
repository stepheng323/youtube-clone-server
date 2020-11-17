import mongoose from 'mongoose';

const { Schema } = mongoose;
const videoSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId, ref: 'User',
  },
  channelImage: {
    type: String,
  },
  views: {
    type: String,
  },
  date: {
    type: Date, default: Date.now
  },
});

const Video = mongoose.model('Video', videoSchema);

export default Video;
