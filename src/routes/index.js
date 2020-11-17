import { Router } from 'express';
import auth from './api/auth';
import video from './api/video';
import channel from './api/channel';

const apiRouter = Router();

apiRouter.use('/api/v1/auth', auth);
apiRouter.use('/api/v1/video', video);
apiRouter.use('/api/v1/channel', channel);

export default apiRouter;
