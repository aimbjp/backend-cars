import { updateUserPassword, changeUserPassword, getUserEmailByToken } from '../../../db/user/reset-password';
import { query } from '../../../db/connection/database';
import bcrypt from 'bcrypt';

// Мокируем зависимость query и функции bcrypt
jest.mock('../../../db/connection/database', () => ({
    query: jest.fn(),
}));

jest.mock('bcrypt', () => ({
    compare: jest.fn(),
    hash: jest.fn(),
}));

describe('User Password Functions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('updateUserPassword', () => {
        it('should update the user password in the database', async () => {
            const email = 'test@example.com';
            const newPassword = 'newPassword123';

            (query as jest.Mock).mockResolvedValueOnce({ rowCount: 1 });

            await updateUserPassword(email, newPassword);

            expect(query).toHaveBeenCalledWith('UPDATE users SET password = $1 WHERE email = $2', [newPassword, email]);
        });

        it('should throw an error if query fails', async () => {
            const email = 'test@example.com';
            const newPassword = 'newPassword123';
            const mockError = new Error('Database error');

            (query as jest.Mock).mockRejectedValueOnce(mockError);

            await expect(updateUserPassword(email, newPassword)).rejects.toThrow('Database error');
        });
    });

    describe('changeUserPassword', () => {
        it('should change the user password if the old password matches', async () => {
            const userId = 1;
            const oldPassword = 'oldPassword123';
            const newPassword = 'newPassword123';
            const hashedNewPassword = 'hashedNewPassword123';
            const mockUser = { password: 'hashedOldPassword123' };

            (query as jest.Mock)
                .mockResolvedValueOnce({ rows: [mockUser] }) // First query result for selecting user
                .mockResolvedValueOnce({ rowCount: 1 }); // Second query result for updating password

            (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true); // Mock bcrypt compare
            (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedNewPassword); // Mock bcrypt hash

            const result = await changeUserPassword(userId, oldPassword, newPassword);

            expect(result).toBe(true);
            expect(query).toHaveBeenNthCalledWith(1, 'SELECT password FROM users WHERE id = $1', [userId]);
            expect(query).toHaveBeenNthCalledWith(2, 'UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, userId]);
        });

        it('should return false if the old password does not match', async () => {
            const userId = 1;
            const oldPassword = 'oldPassword123';
            const newPassword = 'newPassword123';
            const mockUser = { password: 'hashedOldPassword123' };

            (query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] }); // First query result for selecting user
            (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false); // Mock bcrypt compare

            const result = await changeUserPassword(userId, oldPassword, newPassword);

            expect(result).toBe(false);
            expect(query).toHaveBeenCalledWith('SELECT password FROM users WHERE id = $1', [userId]);
        });

        it('should return false if the user is not found', async () => {
            const userId = 1;
            const oldPassword = 'oldPassword123';
            const newPassword = 'newPassword123';

            (query as jest.Mock).mockResolvedValueOnce({ rows: [] }); // First query result for selecting user

            const result = await changeUserPassword(userId, oldPassword, newPassword);

            expect(result).toBe(false);
            expect(query).toHaveBeenCalledWith('SELECT password FROM users WHERE id = $1', [userId]);
        });

        it('should throw an error if query fails', async () => {
            const userId = 1;
            const oldPassword = 'oldPassword123';
            const newPassword = 'newPassword123';
            const mockError = new Error('Database error');

            (query as jest.Mock).mockRejectedValueOnce(mockError);

            await expect(changeUserPassword(userId, oldPassword, newPassword)).rejects.toThrow('Database error');

            expect(query).toHaveBeenCalledWith('SELECT password FROM users WHERE id = $1', [userId]);
        });
    });

    describe('getUserEmailByToken', () => {
        it('should return the email if the token is found', async () => {
            const token = 'validToken';
            const mockEmail = 'test@example.com';

            (query as jest.Mock).mockResolvedValueOnce({ rows: [{ email: mockEmail }] });

            const result = await getUserEmailByToken(token);

            expect(result).toBe(mockEmail);
            expect(query).toHaveBeenCalledWith('SELECT email FROM password_reset_tokens WHERE token = $1', [token]);
        });

        it('should return undefined if the token is not found', async () => {
            const token = 'invalidToken';

            (query as jest.Mock).mockResolvedValueOnce({ rows: [] });

            const result = await getUserEmailByToken(token);

            expect(result).toBeUndefined();
            expect(query).toHaveBeenCalledWith('SELECT email FROM password_reset_tokens WHERE token = $1', [token]);
        });

        it('should return undefined and log error if query fails', async () => {
            const token = 'tokenToFind';
            const mockError = new Error('Database error');

            (query as jest.Mock).mockRejectedValueOnce(mockError);

            const result = await getUserEmailByToken(token);

            expect(result).toBeUndefined();
            expect(query).toHaveBeenCalledWith('SELECT email FROM password_reset_tokens WHERE token = $1', [token]);
        });
    });
});
