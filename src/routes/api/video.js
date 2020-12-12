import { Router } from 'express';
import { checkAuth } from '../../middlewares/auth';
import {
  getVideo, uploadVideo, uploadVideoDetails, getRecommendedVideos, updateViewCount, search,
} from '../../controllers/video';
import { uploadvideo, uploadimage } from '../../config/multer';

const video = Router();

video.put('/', checkAuth, uploadvideo.single('video'), uploadVideo);
video.patch('/:id', checkAuth, uploadimage.single('thumbnail'), uploadVideoDetails);
video.get('/watch/:id', getVideo);
video.patch('/view/:videoId', checkAuth, updateViewCount);
video.get('/recommended', getRecommendedVideos);
video.get('/search/:searchQuery', search);

export default video;
