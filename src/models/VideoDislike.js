import mongoose from 'mongoose';

const { Schema } = mongoose;

const dislikeSchema = Schema(
  {
    video: { type: Schema.Types.ObjectId, ref: 'Video' },
    dislikedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const DisLike = mongoose.model('Dislike', dislikeSchema);

export default DisLike;
