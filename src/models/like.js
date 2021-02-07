import mongoose from 'mongoose';

const { Schema } = mongoose;

const likeSchema = Schema(
  {
    video: { type: Schema.Types.ObjectId, ref: 'Video' },
    likedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    playlist: {
      type: String,
    },
  },
  { timestamps: true }
);

const Like = mongoose.model('Like', likeSchema);

export default Like;
