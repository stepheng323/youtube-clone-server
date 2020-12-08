import { Router } from 'express';
import { checkAuth } from '../../middlewares/auth';
import {
  getPresignedUrl, getVideo, getVideoThumbnailPresignedUrl,
  uploadVideo, uploadVideoDetails, getRecommendedVideos, updateViewCount,
} from '../../controllers/video';
import { uploadvideo, uploadimage } from '../../config/multer';

const video = Router();

video.put('/', checkAuth, uploadvideo.single('video'), uploadVideo);
video.patch('/:id', checkAuth, uploadimage.single('thumbnail'), uploadVideoDetails);
video.get('/watch/:id', getVideo);
video.patch('/view/vidoeId', updateViewCount);
video.get('/presign', checkAuth, getPresignedUrl);
video.get('/presign-thumbnail', checkAuth, getVideoThumbnailPresignedUrl);
video.get('/recommended', getRecommendedVideos);

export default video;
