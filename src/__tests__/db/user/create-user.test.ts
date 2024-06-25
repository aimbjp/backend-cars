import { createUser } from '../../../db/user/create-user';
import { query } from '../../../db/connection/database';

// Мокируем зависимость query
jest.mock('../../../db/connection/database', () => ({
    query: jest.fn(),
}));

describe('createUser', () => {
    const mockUser = {
        username: 'testuser',
        password: 'hashedpassword',
        email: 'testuser@example.com',
        name: 'Test',
        surname: 'User',
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new user and return user data excluding password', async () => {
        const mockQueryResult = {
            rows: [{
                id: 1,
                username: 'testuser',
                email: 'testuser@example.com',
                name: 'Test',
                surname: 'User',
                role: 'user'
            }],
        };

        (query as jest.Mock).mockResolvedValue(mockQueryResult);

        const result = await createUser(mockUser);

        expect(query).toHaveBeenCalledWith(
            'INSERT INTO users (username, password, email, name, surname) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, name, surname, role',
            [mockUser.username, mockUser.password, mockUser.email, mockUser.name, mockUser.surname]
        );

        expect(result).toEqual({
            id: 1,
            username: 'testuser',
            email: 'testuser@example.com',
            name: 'Test',
            surname: 'User',
            role: 'user',
            userId: 1,
        });
    });

    it('should throw an error if database query fails', async () => {
        const mockError = new Error('Database error');
        (query as jest.Mock).mockRejectedValue(mockError);

        await expect(createUser(mockUser)).rejects.toThrow('Database error');

        expect(query).toHaveBeenCalledWith(
            'INSERT INTO users (username, password, email, name, surname) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, name, surname, role',
            [mockUser.username, mockUser.password, mockUser.email, mockUser.name, mockUser.surname]
        );
    });
});
