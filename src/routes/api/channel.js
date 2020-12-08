import { Router } from 'express';
import {
  createChannelWithUserAccount, createChannel,
  getChannel,
  getChannelCount,
} from '../../controllers/channel';
import { checkAuth } from '../../middlewares/auth';

const channel = Router();

channel.post('/with-user-account', checkAuth, createChannelWithUserAccount);
channel.post('/', checkAuth, createChannel);
channel.get('/count', checkAuth, getChannelCount);
channel.get('/:channelName', getChannel);

export default channel;
