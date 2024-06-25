// src/__tests__/getUsersFromDB.test.ts
import { query } from '../../../db/connection/database';
import { getUsersFromDB } from '../../../db/users/users';

// Настройка мока
jest.mock('../../../db/connection/database');

describe('getUsersFromDB', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return users from the database', async () => {
        const mockUsers = {
            rows: [
                { userId: 1, email: 'john.doe@example.com', username: 'johndoe', name: 'John' },
                { userId: 2, email: 'jane.doe@example.com', username: 'janedoe', name: 'Jane' }
            ]
        };
        (query as jest.Mock).mockResolvedValue(mockUsers);

        const result = await getUsersFromDB();

        expect(query).toHaveBeenCalledWith('SELECT id as "userId", email, username, name FROM users;');
        expect(result).toEqual(mockUsers.rows);
    });

    it('should throw an error if query fails', async () => {
        const mockError = new Error('Database query failed');
        (query as jest.Mock).mockRejectedValue(mockError);

        await expect(getUsersFromDB()).rejects.toThrow('Database query failed');
        expect(query).toHaveBeenCalledWith('SELECT id as "userId", email, username, name FROM users;');
    });
});
