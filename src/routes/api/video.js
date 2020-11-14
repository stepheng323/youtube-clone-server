import { Router } from 'express';
import { checkAuth } from '../../middlewares/auth';
import { getPresignedUrl, saveVideo } from '../../controllers/video';

const video = Router();

video.get('/presign', checkAuth, getPresignedUrl);
video.post('/', checkAuth, saveVideo);


export default video;
