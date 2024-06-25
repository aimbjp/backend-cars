import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
    register,
    login,
    refreshToken,
    logout,
    requestPasswordReset,
    resetPassword,
    changePasswordController
} from '../../controllers/auth/auth-controller';
import { createUser } from "../../db/user/create-user";
import { findUserByEmail, findUserById, findUserByUsername, getUserPasswordByEmail } from "../../db/user/find-user";
import {
    deleteResetToken,
    generateAccessToken,
    generateRefreshToken,
    generateResetToken,
    verifyRefreshToken,
    verifyResetToken
} from "../../services/token-utils";
import { findRefreshToken, removeRefreshToken } from "../../db/user/refresh-token";
import { changeUserPassword, getUserEmailByToken, updateUserPassword } from "../../db/user/reset-password";
import { sendResetEmail } from "../../services/email-service";
import { getUserIdFromToken } from "../../middleware/auth-middleware";

// Мокаем зависимости
jest.mock('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('../../db/user/create-user');
jest.mock('../../db/user/find-user');
jest.mock('../../services/token-utils');
jest.mock('../../db/user/refresh-token');
jest.mock('../../db/user/reset-password');
jest.mock('../../services/email-service');
jest.mock('../../middleware/auth-middleware');

const app = express();
app.use(express.json());
app.post('/register', register);
app.post('/login', login);
app.post('/refresh-token', refreshToken);
app.post('/logout', logout);
app.post('/request-password-reset', requestPasswordReset);
app.post('/reset-password', resetPassword);
app.post('/change-password', changePasswordController);

describe('Auth Controller', () => {
    describe('register', () => {
        it('should register a new user', async () => {
            (findUserByEmail as jest.Mock).mockResolvedValue(null);
            (findUserByUsername as jest.Mock).mockResolvedValue(null);
            (createUser as jest.Mock).mockResolvedValue({ id: 1, email: 'test@example.com' });
            (generateAccessToken as jest.Mock).mockReturnValue('accessToken');
            (generateRefreshToken as jest.Mock).mockResolvedValue('refreshToken');
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

            const response = await request(app)
                .post('/register')
                .send({ username: 'testuser', password: 'password', email: 'test@example.com' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                success: true,
                message: 'User created successfully',
                user: { id: 1, email: 'test@example.com' },
                accessToken: 'accessToken',
                refreshToken: 'refreshToken'
            });
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .post('/register')
                .send({ username: 'testuser' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ success: false, message: 'Email, username and password are required' });
        });

        it('should return 409 if email is already in use', async () => {
            (findUserByEmail as jest.Mock).mockResolvedValue({ id: 1 });

            const response = await request(app)
                .post('/register')
                .send({ username: 'testuser', password: 'password', email: 'test@example.com' });

            expect(response.status).toBe(409);
            expect(response.body).toEqual({ success: false, message: 'Email is already in use' });
        });

        it('should return 409 if username is already in use', async () => {
            (findUserByEmail as jest.Mock).mockResolvedValue(null);
            (findUserByUsername as jest.Mock).mockResolvedValue({ id: 1 });

            const response = await request(app)
                .post('/register')
                .send({ username: 'testuser', password: 'password', email: 'test3@example.com' });

            expect(response.status).toBe(409);
            expect(response.body).toEqual({ success: false, message: 'Username is already in use' });
        });

        it('should return 400 if email format is invalid', async () => {
            const response = await request(app)
                .post('/register')
                .send({ username: 'testuser', password: 'password', email: 'invalid-email' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ success: false, message: 'Invalid email format' });
        });

        it('should return 500 on server error', async () => {
            (findUserByEmail as jest.Mock).mockRejectedValue(new Error('Server error'));

            const response = await request(app)
                .post('/register')
                .send({ username: 'testuser', password: 'password', email: 'test@example.com' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ success: false, message: 'Error registering new user' });
        });
    });

    describe('login', () => {
        it('should authenticate a user and return tokens', async () => {
            const user = { id: 1, email: 'test@example.com', username: 'testuser', password: 'hashedPassword' };
            (findUserByEmail as jest.Mock).mockResolvedValue(user);
            (getUserPasswordByEmail as jest.Mock).mockResolvedValue('hashedPassword');
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (generateAccessToken as jest.Mock).mockReturnValue('accessToken');
            (generateRefreshToken as jest.Mock).mockResolvedValue('refreshToken');

            const response = await request(app)
                .post('/login')
                .send({ email: 'test@example.com', password: 'password' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                accessToken: 'accessToken',
                refreshToken: 'refreshToken',
                user: { id: user.id, email: user.email, username: user.username }
            });
        });

        it('should return 404 if user is not found', async () => {
            (findUserByEmail as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .post('/login')
                .send({ email: 'test@example.com', password: 'password' });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ success: false, message: 'User not found' });
        });

        it('should return 401 if password is invalid', async () => {
            const user = { id: 1, email: 'test@example.com', username: 'testuser', password: 'hashedPassword' };
            (findUserByEmail as jest.Mock).mockResolvedValue(user);
            (getUserPasswordByEmail as jest.Mock).mockResolvedValue('hashedPassword');
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const response = await request(app)
                .post('/login')
                .send({ email: 'test@example.com', password: 'password' });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ success: false, message: 'Invalid credentials' });
        });

        it('should return 500 on server error', async () => {
            (findUserByEmail as jest.Mock).mockRejectedValue(new Error('Server error'));

            const response = await request(app)
                .post('/login')
                .send({ email: 'test@example.com', password: 'password' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ success: false, message: 'Internal server error' });
        });
    });

    describe('refreshToken', () => {
        it('should return a new access token', async () => {
            const user = { id: 1, email: 'test@example.com', username: 'testuser' };
            (verifyRefreshToken as jest.Mock).mockReturnValue({ userId: user.id });
            (findRefreshToken as jest.Mock).mockResolvedValue(true);
            (findUserById as jest.Mock).mockResolvedValue(user);
            (generateAccessToken as jest.Mock).mockReturnValue('newAccessToken');

            const response = await request(app)
                .post('/refresh-token')
                .send({ refreshToken: 'validRefreshToken' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true, accessToken: 'newAccessToken' });
        });

        it('should return 401 if refresh token is not provided', async () => {
            const response = await request(app)
                .post('/refresh-token')
                .send({});

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ success: false, message: 'Refresh token is required' });
        });

        it('should return 403 if refresh token is invalid', async () => {
            (verifyRefreshToken as jest.Mock).mockReturnValue(null);
            (findRefreshToken as jest.Mock).mockResolvedValue(false);

            const response = await request(app)
                .post('/refresh-token')
                .send({ refreshToken: 'invalidRefreshToken' });

            expect(response.status).toBe(403);
            expect(response.body).toEqual({ success: false, message: 'Invalid refresh token' });
        });

        it('should return 404 if user is not found', async () => {
            (verifyRefreshToken as jest.Mock).mockReturnValue({ userId: 1 });
            (findRefreshToken as jest.Mock).mockResolvedValue(true);
            (findUserById as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .post('/refresh-token')
                .send({ refreshToken: 'validRefreshToken' });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ success: false, message: 'User not found' });
        });

        it('should return 500 on server error', async () => {
            (verifyRefreshToken as jest.Mock).mockImplementation(() => { throw new Error('Server error'); });

            const response = await request(app)
                .post('/refresh-token')
                .send({ refreshToken: 'validRefreshToken' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ success: false, message: 'Internal server error' });
        });

    });

    describe('logout', () => {
        it('should log out a user and invalidate the refresh token', async () => {
            (verifyRefreshToken as jest.Mock).mockReturnValue({ userId: 1 });
            (removeRefreshToken as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .post('/logout')
                .send({ refreshToken: 'validRefreshToken' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true, message: 'User logged out successfully' });
        });

        it('should return 400 if refresh token is not provided', async () => {
            const response = await request(app)
                .post('/logout')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ success: false, message: 'Refresh token is required' });
        });

        it('should return 403 if refresh token is invalid', async () => {
            (verifyRefreshToken as jest.Mock).mockReturnValue(null);

            const response = await request(app)
                .post('/logout')
                .send({ refreshToken: 'invalidRefreshToken' });

            expect(response.status).toBe(403);
            expect(response.body).toEqual({ success: false, message: 'Invalid refresh token' });
        });

        it('should return 500 on server error', async () => {
            (verifyRefreshToken as jest.Mock).mockImplementation(() => { throw new Error('Server error'); });

            const response = await request(app)
                .post('/logout')
                .send({ refreshToken: 'validRefreshToken' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ success: false, message: 'Internal server error' });
        });
    });

    describe('requestPasswordReset', () => {
        it('should send a password reset email', async () => {
            (findUserByEmail as jest.Mock).mockResolvedValue({ id: 1, email: 'test@example.com' });
            (generateResetToken as jest.Mock).mockResolvedValue('resetToken');
            (sendResetEmail as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .post('/request-password-reset')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true, message: 'Reset email sent' });
        });

        it('should return 400 if email is not provided', async () => {
            const response = await request(app)
                .post('/request-password-reset')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ success: false, message: 'Email is required' });
        });

        it('should return 400 if user is not registered', async () => {
            (findUserByEmail as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .post('/request-password-reset')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ success: false, message: 'This user is not registered' });
        });

        it('should return 500 on server error', async () => {
            (findUserByEmail as jest.Mock).mockImplementation(() => { throw new Error('Server error'); });

            const response = await request(app)
                .post('/request-password-reset')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ success: false, message: 'Internal server error' });
        });
    });

    describe('resetPassword', () => {
        it('should reset the password', async () => {
            (verifyResetToken as jest.Mock).mockResolvedValue(true);
            (getUserEmailByToken as jest.Mock).mockResolvedValue('test@example.com');
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            (updateUserPassword as jest.Mock).mockResolvedValue(true);
            (deleteResetToken as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .post('/reset-password')
                .send({ token: 'resetToken', password: 'newPassword' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true, message: 'Password has been reset successfully' });
        });

        it('should return 400 if token is invalid or expired', async () => {
            (verifyResetToken as jest.Mock).mockResolvedValue(false);
            (getUserEmailByToken as jest.Mock).mockResolvedValue('');

            const response = await request(app)
                .post('/reset-password')
                .send({ token: 'invalidToken', password: 'newPassword' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ success: false, message: 'Invalid or expired reset token' });
        });

        it('should return 500 on server error', async () => {
            (verifyResetToken as jest.Mock).mockImplementation(() => { throw new Error('Server error'); });

            const response = await request(app)
                .post('/reset-password')
                .send({ token: 'resetToken', password: 'newPassword' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ success: false, message: 'Internal server error' });
        });
    });

    describe('changePasswordController', () => {
        it('should change the user password', async () => {
            (getUserIdFromToken as jest.Mock).mockReturnValue(1);
            (changeUserPassword as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .post('/change-password')
                .send({ oldPassword: 'oldPassword', newPassword: 'newPassword' })
                .set('Authorization', 'Bearer validToken');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true, message: 'Password successfully updated.' });
        });

        it('should return 403 if access is denied', async () => {
            (getUserIdFromToken as jest.Mock).mockReturnValue(null);

            const response = await request(app)
                .post('/change-password')
                .send({ oldPassword: 'oldPassword', newPassword: 'newPassword' })
                .set('Authorization', 'Bearer invalidToken');

            expect(response.status).toBe(403);
            expect(response.body).toEqual({ success: false, message: 'Access denied.' });
        });

        it('should return 400 if password change failed', async () => {
            (getUserIdFromToken as jest.Mock).mockReturnValue(1);
            (changeUserPassword as jest.Mock).mockResolvedValue(false);

            const response = await request(app)
                .post('/change-password')
                .send({ oldPassword: 'oldPassword', newPassword: 'newPassword' })
                .set('Authorization', 'Bearer validToken');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ success: false, message: 'Could not update password.' });
        });

        it('should return 500 on server error', async () => {
            (getUserIdFromToken as jest.Mock).mockReturnValue(1);
            (changeUserPassword as jest.Mock).mockImplementation(() => { throw new Error('Server error'); });

            const response = await request(app)
                .post('/change-password')
                .send({ oldPassword: 'oldPassword', newPassword: 'newPassword' })
                .set('Authorization', 'Bearer validToken');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ success: false, message: 'Internal server error' });
        });
    });
});
