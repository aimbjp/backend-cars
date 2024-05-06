import { Request, Response } from 'express';
import { saveMessageToDB, getMessagesFromDB } from '../../db/chat/message-database';

export const saveMessage = async (req: Request, res: Response) => {
    try {
        const { sender_id, receiver_id, content } = req.body;
        const message = {
            sender_id: sender_id,
            receiver_id: receiver_id,
            content: content,
            // Добавляем метку, указывающую на то, что сообщение уже было сохранено
            saved: true
        };

        // Проверяем, было ли сообщение уже сохранено
        if (!message.saved) {
            const savedMessage = await saveMessageToDB(message);
            res.status(201).json({ message: 'Message saved successfully', data: message });
        } else {
            console.log('Message already saved');
            res.status(200).json({ message: 'Message already saved' });
        }
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ message: 'Failed to save message' });
    }
};


export const getMessages = async (req: Request, res: Response) => {
    try {
        const { sender_id, receiver_id } = req.query;
        if (typeof sender_id === 'string' && typeof receiver_id === 'string') {
            const messages = await getMessagesFromDB(sender_id, receiver_id);
            res.status(200).json({ messages });
        } else {
            console.error('sender_id or receiver_id is not defined');
        }
    } catch (error) {
        console.error('Error getting messages:', error);
        res.status(500).json({ message: 'Failed to retrieve messages' });
    }
};
