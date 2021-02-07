import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = Schema({
  commenter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  responseTo: {
    type: String,
  },

  video: { type: Schema.Types.ObjectId, ref: 'Video' },

  content: {
    type: String,
  },
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
