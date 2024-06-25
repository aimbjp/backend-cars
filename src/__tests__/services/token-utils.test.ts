import jwt from 'jsonwebtoken';
import { query } from '../../db/connection/database';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    generateResetToken,
    verifyResetToken,
    deleteResetToken,
    verifyAccessToken
} from '../../services/token-utils';
import { randomBytes } from 'crypto';
import { saveRefreshToken } from '../../db/user/refresh-token';

// Мокаем зависимости
jest.mock('jsonwebtoken');
jest.mock('../../db/connection/database');
jest.mock('crypto', () => ({
    randomBytes: jest.fn()
}));
jest.mock('../../db/user/refresh-token');

describe('auth-utils', () => {
    const user = { userId: '1', username: 'testuser' };
    const userRegistered = { userId: '1', username: 'testuser', email: 'test@example.com' };
    const token = 'testtoken';
    const refreshToken = 'refreshtoken';
    const resetToken = 'resettoken';
    const email = 'test@example.com';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('generateAccessToken', () => {
        it('should generate an access token', () => {
            (jwt.sign as jest.Mock).mockReturnValue(token);
            const result = generateAccessToken(user as any);
            expect(jwt.sign).toHaveBeenCalledWith(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            expect(result).toBe(token);
        });
    });

    describe('generateRefreshToken', () => {
        it('should generate a refresh token and save it to the database', async () => {
            (jwt.sign as jest.Mock).mockReturnValue(refreshToken);
            await generateRefreshToken(userRegistered as any);
            expect(jwt.sign).toHaveBeenCalledWith({ userId: userRegistered.userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
            expect(saveRefreshToken).toHaveBeenCalledWith(userRegistered.userId, refreshToken, 7 * 24 * 60 * 60);
        });

        it('should throw an error if REFRESH_TOKEN_SECRET is not defined', async () => {
            delete process.env.REFRESH_TOKEN_SECRET;
            await expect(generateRefreshToken(userRegistered as any)).rejects.toThrow('REFRESH_TOKEN_SECRET is not defined');
        });
    });

    describe('verifyRefreshToken', () => {
        it('should verify a refresh token', () => {
            (jwt.verify as jest.Mock).mockReturnValue(userRegistered);
            const result = verifyRefreshToken(refreshToken);
            expect(jwt.verify).toHaveBeenCalledWith(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            expect(result).toBe(userRegistered);
        });

        it('should return null if token verification fails', () => {
            (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error(); });
            const result = verifyRefreshToken(refreshToken);
            expect(result).toBeNull();
        });
    });

    describe('generateResetToken', () => {
        it('should generate a reset token and save it to the database', async () => {
            // Используйте 'utf-8' для правильного преобразования строки в буфер
            const resetTokenHex = Buffer.from(resetToken, 'utf-8').toString('hex');
            (randomBytes as jest.Mock).mockReturnValue(Buffer.from(resetToken, 'utf-8'));
            const result = await generateResetToken(email);
            expect(randomBytes).toHaveBeenCalledWith(20);
            expect(query).toHaveBeenCalledWith(
                'INSERT INTO password_reset_tokens (email, token, expires_at) VALUES ($1, $2, $3)',
                [email, resetTokenHex, expect.any(Date)]
            );
            expect(result).toBe(resetTokenHex);
        });
    });

    describe('verifyResetToken', () => {
        it('should verify a reset token', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [{ token: resetToken, expires_at: new Date(Date.now() + 3600000) }] });
            const result = await verifyResetToken(resetToken);
            expect(result).toBe(true);
        });

        it('should return false if token is not found', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [] });
            const result = await verifyResetToken(resetToken);
            expect(result).toBe(false);
        });

        it('should return false if token is expired', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [{ token: resetToken, expires_at: new Date(Date.now() - 3600000) }] });
            const result = await verifyResetToken(resetToken);
            expect(result).toBe(false);
        });
    });

    describe('deleteResetToken', () => {
        it('should delete a reset token from the database', async () => {
            await deleteResetToken(resetToken);
            expect(query).toHaveBeenCalledWith('DELETE FROM password_reset_tokens WHERE token = $1', [resetToken]);
        });

        it('should throw an error if deletion fails', async () => {
            (query as jest.Mock).mockRejectedValue(new Error('Deletion error'));
            await expect(deleteResetToken(resetToken)).rejects.toThrow('Deletion error');
        });
    });

    describe('verifyAccessToken', () => {
        it('should verify an access token', () => {
            (jwt.verify as jest.Mock).mockReturnValue(userRegistered);
            const result = verifyAccessToken(token);
            expect(jwt.verify).toHaveBeenCalledWith(token, process.env.ACCESS_TOKEN_SECRET);
            expect(result).toBe(userRegistered);
        });

        it('should return null if token verification fails', () => {
            (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error(); });
            const result = verifyAccessToken(token);
            expect(result).toBeNull();
        });
    });
});
