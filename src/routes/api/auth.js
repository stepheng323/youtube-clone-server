import { Router } from 'express';
import {
  signUp, login, getToken, logout,
} from '../../controllers/auth';

const auth = Router();

auth.post('/signup', signUp);
auth.post('/login', login);
auth.post('/logout', logout);
auth.post('/token', getToken);

export default auth;
