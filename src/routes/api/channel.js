import { Router } from 'express';
import {
  createChannelWithUserAccount,
  createChannel,
  getChannel,
  getChannelInfo,
  setupAccount
} from '../../controllers/channel';
import { checkAuth } from '../../middlewares/auth';
import { uploadimage } from '../../config/multer';

const channel = Router();

channel.post('/', checkAuth, createChannel);
channel.post('/with-user-account', checkAuth, createChannelWithUserAccount);
channel.patch('/setup', checkAuth, uploadimage.single('channelAvatar'), setupAccount);
channel.get('/', checkAuth, getChannelInfo);
channel.get('/:channelName', getChannel);

export default channel;
