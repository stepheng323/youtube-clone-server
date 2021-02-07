import { Router } from 'express';
import { getUserHistory } from '../../controllers/history';
import { checkAuth } from '../../middlewares/auth';
import paginate from '../../middlewares/pagination';
import History from '../../models/history';

const history = Router();

history.get('/', checkAuth, paginate(History, {}, [],
  [{
    path: 'video',
    select: ['title', 'description', 'thumbnail', 'duration', 'viewsCount', 'createdAt'],
    populate: { path: 'channel', select: ['name'] },
  }], { updatedAt: 'desc' }, 'user'), getUserHistory);

export default history;
