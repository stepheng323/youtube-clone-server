import { Router } from 'express';
import {
  createChannelWithUserAccount,
  createChannel,
  getChannel,
  getChannelInfo,
  setupAccount,
  getAllChannels,
  channelPopularVideos,
  getChannelVideos
} from '../../controllers/channel';
import { checkAuth, getUserChannel } from '../../middlewares/auth';
import { uploadimage } from '../../config/multer';
import paginate from '../../middlewares/pagination';
import Channel from '../../models/channel';
import { getChannelId } from '../../middlewares/channel';
import Video from '../../models/video';

const channel = Router();

channel.post('/', checkAuth, createChannel);
channel.post('/with-user-account', checkAuth, createChannelWithUserAccount);
channel.patch('/setup', checkAuth, uploadimage.single('channelAvatar'), setupAccount);
channel.get('/', checkAuth, getChannelInfo);
channel.get('/all/channels', checkAuth, paginate(Channel, {}, [], [], '', ''), getAllChannels);
channel.get('/videos/:channelName', getChannelId, paginate(Video, {}, [], [], { createdAt: -1 }), getChannelVideos);
channel.get('/popular-videos/:channelName', getChannelId, paginate(Video, {}, [], [], { viewsCount: -1 }), channelPopularVideos);
channel.get('/video-content', checkAuth, getUserChannel, paginate(Video, {}, [], [], { createdAt: -1 }, 'my-channel-videos'), getChannelVideos);
channel.get('/:channelName', getChannel);

export default channel;
