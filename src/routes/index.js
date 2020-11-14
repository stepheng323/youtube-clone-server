import { Router } from 'express';
import auth from './api/auth';
import video from './api/video';

const apiRouter = Router();

apiRouter.use('/api/v1/auth', auth);
apiRouter.use('/api/v1/video', video);

export default apiRouter;
