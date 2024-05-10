import dotenv from 'dotenv';
import express, { Express } from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { handleSocketConnection } from './chat/websocket-server';
import router from "./routes";
import multer from 'multer';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());

app.use('/api', router);

////////////////////////////////////////////////////////////////

// const options = {
//     definition: {
//         openapi: '3.0.0',
//         servers: [{
//            url: 'http://localhost:3000/',
//         }],
//         info: {
//             title: 'API Documentation',
//             version: '1.0.0',
//             description: 'Cars server',
//         },
//     },
//     apis: ['./routes/*.js'],
// };
//
// const swaggerSpec = swaggerJsdoc(options);
//
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

////////////////////////////////

////////////////////////////////////////////////////////////////

// Setup storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'media-chats/');
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Upload endpoint for multiple files
app.post('/api/upload', upload.array('files'), (req: express.Request, res: express.Response) => {
    const filesUrls: string[] = (req.files as Express.Multer.File[]).map(file => `http://pumase.ru/media-chats/${file.filename}`);
    res.json({ filesUrls });
});

// Static serve media files
app.use('/media-chats', express.static('media-chats'));

////////////////////////////////////////////////////////////////

const server = http.createServer(app);
const io = new SocketIOServer(server,{
    cors: {
        origin: "*", // Разрешаем доступ с любого источника
    }
});

handleSocketConnection(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));







export default app;

