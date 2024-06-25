import express from 'express';
import { saveMessage, getMessages } from '../controllers/chat/chat-controllers';

const chatRoutes = express.Router();

chatRoutes.post('/message', saveMessage);
chatRoutes.get('/messages', getMessages);

export default chatRoutes;
