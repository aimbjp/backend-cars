import request from 'supertest';
import express from 'express';
import { findUserById } from '../../db/user/find-user';
import { updateUser } from '../../db/user/update-user';
import { getUserIdFromToken } from '../../middleware/auth-middleware';
import {getUserByIdController, updateUserController} from "../../controllers/profile/user-controller";

// Мокаем зависимости
jest.mock('../../db/user/find-user');
jest.mock('../../db/user/update-user');
jest.mock('../../middleware/auth-middleware');

const app = express();
app.use(express.json());
app.get('/user', getUserByIdController);
app.put('/user', updateUserController);

describe('User Controller', () => {
    describe('getUserByIdController', () => {
        it('should return 401 if authorization token is missing', async () => {
            const response = await request(app).get('/user');

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ success: false, message: 'Authorization token is missing.' });
        });

        it('should return 404 if user is not found', async () => {
            (getUserIdFromToken as jest.Mock).mockReturnValue(1);
            (findUserById as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .get('/user')
                .set('Authorization', 'Bearer validToken');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ success: false, message: 'User not found' });
        });

        it('should return user if found', async () => {
            const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
            (getUserIdFromToken as jest.Mock).mockReturnValue(1);
            (findUserById as jest.Mock).mockResolvedValue(mockUser);

            const response = await request(app)
                .get('/user')
                .set('Authorization', 'Bearer validToken');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true, user: mockUser });
        });
    });

    describe('updateUserController', () => {
        it('should return 401 if authorization token is missing', async () => {
            const response = await request(app).put('/user').send({ username: 'newuser' });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ success: false, message: 'Authorization token is missing.' });
        });

        it('should return 403 if token is invalid or does not contain user ID', async () => {
            (getUserIdFromToken as jest.Mock).mockReturnValue(null);

            const response = await request(app)
                .put('/user')
                .send({ username: 'newuser' })
                .set('Authorization', 'Bearer invalidToken');

            expect(response.status).toBe(403);
            expect(response.body).toEqual({ success: false, message: 'Invalid token or token does not contain user ID.' });
        });

        it('should return updated user on success', async () => {
            const mockUpdatedUser = { id: 1, username: 'updateduser', email: 'updated@example.com' };
            (getUserIdFromToken as jest.Mock).mockReturnValue(1);
            (updateUser as jest.Mock).mockResolvedValue(mockUpdatedUser);

            const response = await request(app)
                .put('/user')
                .send({ username: 'updateduser' })
                .set('Authorization', 'Bearer validToken');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true, user: mockUpdatedUser });
        });

        it('should return 500 on server error', async () => {
            (getUserIdFromToken as jest.Mock).mockReturnValue(1);
            (updateUser as jest.Mock).mockImplementation(() => {
                throw new Error('Server error');
            });

            const response = await request(app)
                .put('/user')
                .send({ username: 'updateduser' })
                .set('Authorization', 'Bearer validToken');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ success: false, message: 'Internal Server Error' });
        });
    });
});
