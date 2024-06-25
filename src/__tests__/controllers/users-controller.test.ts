import request from 'supertest';
import express from 'express';
import { getUsersFromDB } from '../../db/users/users';
import {getAllUsers} from "../../controllers/users/users-controller";

// Мокаем зависимость
jest.mock('../../db/users/users');

const app = express();
app.use(express.json());
app.get('/users', getAllUsers);

describe('getAllUsers Controller', () => {
    it('should return a list of users', async () => {
        const mockUsers = [
            { id: 1, username: 'user1', email: 'user1@example.com' },
            { id: 2, username: 'user2', email: 'user2@example.com' }
        ];
        (getUsersFromDB as jest.Mock).mockResolvedValue(mockUsers);

        const response = await request(app).get('/users');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUsers);
    });

    it('should return 500 on server error', async () => {
        (getUsersFromDB as jest.Mock).mockImplementation(() => {
            throw new Error('Server error');
        });

        const response = await request(app).get('/users');

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });
});
