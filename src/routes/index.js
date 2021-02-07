import { Router } from 'express';
import auth from './api/auth';
import video from './api/video';
import channel from './api/channel';
import comment from './api/comment';
import history from './api/history';
import subscriber from './api/subscriber';
import like from './api/like';

const apiRouter = Router();

apiRouter.use('/api/v1/auth', auth);
apiRouter.use('/api/v1/video', video);
apiRouter.use('/api/v1/channel', channel);
apiRouter.use('/api/v1/comment', comment);
apiRouter.use('/api/v1/history', history);
apiRouter.use('/api/v1/subscriber', subscriber);
apiRouter.use('/api/v1/like', like)

export default apiRouter;
