import { Router } from 'express';
import { saveComment, getComments } from '../../controllers/comment';
import { checkAuth } from '../../middlewares/auth';
import paginate from '../../middlewares/pagination';
import Comment from '../../models/comments';


const comment = Router();

comment.post('/:videoId', checkAuth, saveComment);
comment.get('/:videoId', paginate(Comment, {}, [], [{ path: 'commenter', select: ['firstName', 'lastName'] }], { createdAt: 'desc' }, 'video'), getComments);

export default comment;
