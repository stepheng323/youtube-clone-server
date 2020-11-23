import { Router } from 'express';
import { checkAuth } from '../../middlewares/auth';
import { getPresignedUrl, getVideoThumbnailPresignedUrl } from '../../controllers/video';

const video = Router();

video.post('/', checkAuth);
video.get('/presign', checkAuth, getPresignedUrl);
video.get('/presign-thumbnail', checkAuth, getVideoThumbnailPresignedUrl);

export default video;
