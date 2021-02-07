import { Router } from 'express';
import { getUserLikedVideos, getUserLikeCount } from '../../controllers/like';
import { checkAuth } from '../../middlewares/auth';
import paginate from '../../middlewares/pagination';
import Like from '../../models/like';

const like = Router();

like.get('/', checkAuth, paginate(Like, {}, [], [{
  path: 'video',
  populate: { path: 'channel' },
}], { createdAt: -1 }, 'likedBy'), getUserLikedVideos);

like.get('/count', checkAuth, getUserLikeCount);
export default like;
