import { Router } from 'express';
import auth from './api/auth';

const apiRouter = Router();

apiRouter.use('/api/v1/auth', auth);

export default apiRouter;
