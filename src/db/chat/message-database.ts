import { query } from '../connection/database';

// Функция для сохранения сообщения в базе данных
export const saveMessageToDB = async (message: any) => {
    try {
        const { sender_id, receiver_id, content, media_url = null,  status = 'sent' } = message;
        const result = await query('INSERT INTO messages (sender_id, receiver_id, content, status, media_url) VALUES ($1, $2, $3, $4, $5) RETURNING *', [sender_id, receiver_id, content, status, media_url]);
        return result.rows[0];
    } catch (error) {
        console.error('Error saving message to DB:', error);
        throw new Error('Failed to save message to DB');
    }
};


// Функция для получения сообщений из базы данных
export const getMessagesFromDB = async (sender_id: string | undefined, receiver_id: string | undefined) => {
    try {
        const senderIdStr = sender_id ? String(sender_id) : '';
        const receiverIdStr = receiver_id ? String(receiver_id) : '';
        const result = await query('SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) ORDER BY timestamp', [senderIdStr, receiverIdStr]);
        return result.rows;
    } catch (error) {
        console.error('Error getting messages from DB:', error);
        throw new Error('Failed to retrieve messages from DB');
    }
};

export const updateMessageStatus = async (messageId: number, newStatus: string) => {
    try {
        await query('UPDATE messages SET status = $1 WHERE id = $2', [newStatus, messageId]);
    } catch (error) {
        console.error('Error updating message status:', error);
        throw new Error('Failed to update message status');
    }
};
