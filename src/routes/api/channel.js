import { Router } from 'express';
import {
  createChannelWithUserAccount, createChannel,
  getChannel,
} from '../../controllers/channel';
import { checkAuth } from '../../middlewares/auth';

const channel = Router();

channel.post('/with-user-account', checkAuth, createChannelWithUserAccount);
channel.post('/', checkAuth, createChannel);
channel.get('/user', checkAuth, getChannel);
export default channel;
