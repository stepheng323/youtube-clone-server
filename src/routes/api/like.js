import { Router } from 'express';
import {
  getUserLikedVideos, getUserLikeCount, watchLater, getWatchLaterVideos,
} from '../../controllers/like';
import { checkAuth } from '../../middlewares/auth';
import paginate from '../../middlewares/pagination';
import Like from '../../models/like';

const like = Router();

like.get('/', checkAuth, paginate(Like, { }, [], [{
  path: 'video',
  populate: { path: 'channel' },
}], { createdAt: -1 }, 'liked'), getUserLikedVideos);

like.get('/count', checkAuth, getUserLikeCount);
like.post('/watch-later/:videoId', checkAuth, watchLater);

like.get('/watch-later/', checkAuth, paginate(Like, {}, [], [{
  path: 'video',
  populate: { path: 'channel' },
}], { createdAt: -1 }, 'watch-later'), getWatchLaterVideos);


export default like;
