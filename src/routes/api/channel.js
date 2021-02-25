import { Router } from 'express';
import {
  createChannelWithUserAccount,
  createChannel,
  getChannel,
  getChannelInfo,
  setupAccount,
  getAllChannels,
  channelPopularVideos
} from '../../controllers/channel';
import { checkAuth } from '../../middlewares/auth';
import { uploadimage } from '../../config/multer';
import paginate from '../../middlewares/pagination';
import Channel from '../../models/channel';

const channel = Router();

channel.post('/', checkAuth, createChannel);
channel.post('/with-user-account', checkAuth, createChannelWithUserAccount);
channel.patch('/setup', checkAuth, uploadimage.single('channelAvatar'), setupAccount);
channel.get('/', checkAuth, getChannelInfo);
channel.get('/:channelName', getChannel);
channel.get('/all/channels', checkAuth, paginate(Channel, {}, [], [], '', ''), getAllChannels);
channel.get('/popular-videos', channelPopularVideos);
export default channel;
