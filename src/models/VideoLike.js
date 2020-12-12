import mongoose from 'mongoose';

const { Schema } = mongoose;

const likeSchema = Schema(
  {
    video: { type: Schema.Types.ObjectId, ref: 'Video' },
    likedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const Like = mongoose.model('User', likeSchema);

export default Like;
