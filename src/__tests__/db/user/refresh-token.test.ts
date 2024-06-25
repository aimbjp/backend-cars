import { saveRefreshToken, removeRefreshToken, findRefreshToken } from '../../../db/user/refresh-token';
import { query } from '../../../db/connection/database';

// Мокируем зависимость query
jest.mock('../../../db/connection/database', () => ({
    query: jest.fn(),
}));

describe('Refresh Token Functions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('saveRefreshToken', () => {
        it('should save a refresh token and delete the oldest if max sessions exceeded', async () => {
            const userId = 1;
            const token = 'newToken';
            const expiresIn = 3600;
            const mockOldTokens = [
                { token_id: 1 },
                { token_id: 2 },
                { token_id: 3 },
            ];

            (query as jest.Mock)
                .mockResolvedValueOnce({ rows: mockOldTokens })
                .mockResolvedValueOnce({ rowCount: 1 })
                .mockResolvedValueOnce({ rowCount: 1 });

            await saveRefreshToken(userId, token, expiresIn);

            expect(query).toHaveBeenNthCalledWith(1, 'SELECT token_id FROM refresh_tokens WHERE user_id = $1 ORDER BY expires_at ASC', [userId]);
            expect(query).toHaveBeenNthCalledWith(2, 'DELETE FROM refresh_tokens WHERE token_id = ANY($1::int[])', [[1]]);
            expect(query).toHaveBeenNthCalledWith(3, 'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)', [
                userId,
                token,
                expect.any(Date),
            ]);
        });

        it('should save a refresh token without deleting any if max sessions not exceeded', async () => {
            const userId = 1;
            const token = 'newToken';
            const expiresIn = 3600;
            const mockOldTokens = [{ token_id: 1 }];

            (query as jest.Mock)
                .mockResolvedValueOnce({ rows: mockOldTokens })
                .mockResolvedValueOnce({ rowCount: 1 });

            await saveRefreshToken(userId, token, expiresIn);

            expect(query).toHaveBeenNthCalledWith(1, 'SELECT token_id FROM refresh_tokens WHERE user_id = $1 ORDER BY expires_at ASC', [userId]);
            expect(query).toHaveBeenNthCalledWith(2, 'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)', [
                userId,
                token,
                expect.any(Date),
            ]);
        });

        it('should throw an error if query fails', async () => {
            const userId = 1;
            const token = 'newToken';
            const expiresIn = 3600;
            const mockError = new Error('Database error');

            (query as jest.Mock).mockRejectedValueOnce(mockError);

            await expect(saveRefreshToken(userId, token, expiresIn)).rejects.toThrow('Database error');

            expect(query).toHaveBeenCalledTimes(1);
            expect(query).toHaveBeenCalledWith('SELECT token_id FROM refresh_tokens WHERE user_id = $1 ORDER BY expires_at ASC', [userId]);
        });
    });

    describe('removeRefreshToken', () => {
        it('should remove a refresh token', async () => {
            const token = 'tokenToRemove';
            (query as jest.Mock).mockResolvedValueOnce({ rowCount: 1 });

            await removeRefreshToken(token);

            expect(query).toHaveBeenCalledWith('DELETE FROM refresh_tokens WHERE token = $1', [token]);
        });

        it('should throw an error if query fails', async () => {
            const token = 'tokenToRemove';
            const mockError = new Error('Database error');

            (query as jest.Mock).mockRejectedValueOnce(mockError);

            await expect(removeRefreshToken(token)).rejects.toThrow('Database error');

            expect(query).toHaveBeenCalledWith('DELETE FROM refresh_tokens WHERE token = $1', [token]);
        });
    });

    describe('findRefreshToken', () => {
        it('should return true if token found', async () => {
            const token = 'existingToken';
            (query as jest.Mock).mockResolvedValueOnce({ rows: [{ token_id: 1 }] });

            const result = await findRefreshToken(token);

            expect(query).toHaveBeenCalledWith('SELECT 1 FROM refresh_tokens WHERE token = $1', [token]);
            expect(result).toBe(true);
        });

        it('should return false if token not found', async () => {
            const token = 'nonexistentToken';
            (query as jest.Mock).mockResolvedValueOnce({ rows: [] });

            const result = await findRefreshToken(token);

            expect(query).toHaveBeenCalledWith('SELECT 1 FROM refresh_tokens WHERE token = $1', [token]);
            expect(result).toBe(false);
        });

        it('should return false and log error if query fails', async () => {
            const token = 'tokenToFind';
            const mockError = new Error('Database error');

            (query as jest.Mock).mockRejectedValueOnce(mockError);

            const result = await findRefreshToken(token);

            expect(query).toHaveBeenCalledWith('SELECT 1 FROM refresh_tokens WHERE token = $1', [token]);
            expect(result).toBe(false);
        });
    });
});
