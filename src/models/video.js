import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
  },
  channelImage: {
    type: String,
  },
  views: {
    type: String,
  },
  date: String,
});

const Video = mongoose.model('Video', videoSchema);

export default Video;
