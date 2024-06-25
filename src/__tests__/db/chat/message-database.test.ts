// src/__tests__/messages.test.ts
import { query } from '../../../db/connection/database';
import { saveMessageToDB, getMessagesFromDB, updateMessageStatus } from '../../../db/chat/message-database';

// Настройка мока
jest.mock('../../../db/connection/database');

describe('Messages Database Operations', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('saveMessageToDB', () => {
        it('should save a message to the database', async () => {
            const mockMessage = { sender_id: 1, receiver_id: 2, content: 'Hello', status: 'sent' };
            const mockResult = { rows: [{ id: 1, ...mockMessage, media_url: null }] };
            (query as jest.Mock).mockResolvedValue(mockResult);

            const result = await saveMessageToDB(mockMessage);

            expect(query).toHaveBeenCalledWith(
                'INSERT INTO messages (sender_id, receiver_id, content, status, media_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [1, 2, 'Hello', 'sent', null]
            );
            expect(result).toEqual(mockResult.rows[0]);
        });

        it('should throw an error if saving a message fails', async () => {
            const mockMessage = { sender_id: 1, receiver_id: 2, content: 'Hello', status: 'sent' };
            const mockError = new Error('Database error');
            (query as jest.Mock).mockRejectedValue(mockError);

            await expect(saveMessageToDB(mockMessage)).rejects.toThrow('Failed to save message to DB');
            expect(query).toHaveBeenCalledWith(
                'INSERT INTO messages (sender_id, receiver_id, content, status, media_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [1, 2, 'Hello', 'sent', null]
            );
        });
    });

    describe('getMessagesFromDB', () => {
        it('should retrieve messages from the database', async () => {
            const mockMessages = {
                rows: [
                    { id: 1, sender_id: 1, receiver_id: 2, content: 'Hello', status: 'sent', media_url: null, timestamp: new Date() }
                ]
            };
            (query as jest.Mock).mockResolvedValue(mockMessages);

            const result = await getMessagesFromDB('1', '2');

            expect(query).toHaveBeenCalledWith(
                'SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) ORDER BY timestamp',
                ['1', '2']
            );
            expect(result).toEqual(mockMessages.rows);
        });

        it('should throw an error if retrieving messages fails', async () => {
            const mockError = new Error('Database error');
            (query as jest.Mock).mockRejectedValue(mockError);

            await expect(getMessagesFromDB('1', '2')).rejects.toThrow('Failed to retrieve messages from DB');
            expect(query).toHaveBeenCalledWith(
                'SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) ORDER BY timestamp',
                ['1', '2']
            );
        });
    });

    describe('updateMessageStatus', () => {
        it('should update the status of a message', async () => {
            const messageId = 1;
            const newStatus = 'read';
            (query as jest.Mock).mockResolvedValue({});

            await updateMessageStatus(messageId, newStatus);

            expect(query).toHaveBeenCalledWith('UPDATE messages SET status = $1 WHERE id = $2', ['read', 1]);
        });

        it('should throw an error if updating message status fails', async () => {
            const messageId = 1;
            const newStatus = 'read';
            const mockError = new Error('Database error');
            (query as jest.Mock).mockRejectedValue(mockError);

            await expect(updateMessageStatus(messageId, newStatus)).rejects.toThrow('Failed to update message status');
            expect(query).toHaveBeenCalledWith('UPDATE messages SET status = $1 WHERE id = $2', ['read', 1]);
        });
    });
});
