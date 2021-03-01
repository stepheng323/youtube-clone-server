import { Router } from 'express';
import { checkAuth } from '../../middlewares/auth';
import Video from '../../models/video';
import paginate from '../../middlewares/pagination';
import {
  getVideo,
  uploadVideo,
  uploadVideoDetails,
  getRecommendedVideos,
  updateViewCount,
  search,
  getVideoDetails,
  getUpnextVideo,
  likeVideo,
  dislikeVideo,
  getMetrics,
  getTrendingVideos,
  getVideoLikeCount,
  getVideoDislikeCount,
  getFeelingStatus,
  getChannelVideos,
  getChannelPlaylist,
  getVideoCount
} from '../../controllers/video';
import { uploadvideo, uploadimage } from '../../config/multer';

const video = Router();

video.put('/', checkAuth, uploadvideo.single('video'), uploadVideo);
video.patch('/:id', checkAuth, uploadimage.single('thumbnail'), uploadVideoDetails);
video.get('/watch/:id', getVideo);
video.get('/details/:id', getVideoDetails);
video.get('/metric-count/:id', getMetrics);
video.get('/upnext', paginate(Video, {}, [], [{ path: 'channel' }]), getUpnextVideo);
video.patch('/view/:videoId', checkAuth, updateViewCount);
video.get('/recommended', paginate(Video, { status: 'public' },
  ['title', 'thumbnail', 'viewsCount', 'duration', 'createdAt'],
  [{ path: 'channel', select: ['name', 'channelAvatar'] }]),
getRecommendedVideos);
video.get('/search/:searchQuery', search);
video.post('/like/:videoId', checkAuth, likeVideo);
video.post('/dislike/:videoId', checkAuth, dislikeVideo);
video.get('/like/:videoId', getVideoLikeCount);
video.get('/dislike/:videoId', getVideoDislikeCount);
video.get('/status/feeling/:videoId', checkAuth, getFeelingStatus);
video.get('/trending', paginate(Video, {}, ['-comments -status'],
  [{ path: 'channel', select: ['name'] }], { createdAt: -1, viewsCount: 'desc' }),
getTrendingVideos);
video.get('/channel/playlist', checkAuth, getChannelPlaylist);
video.get('/count/', checkAuth, getVideoCount);
export default video;
