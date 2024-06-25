import { findUserByUsername, findUserByEmail, findUserById, getUserPasswordByEmail } from '../../../db/user/find-user';
import { query } from '../../../db/connection/database';

// Мокируем зависимость query
jest.mock('../../../db/connection/database', () => ({
    query: jest.fn(),
}));

describe('User Find Functions', () => {
    const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'testuser@example.com',
        name: 'Test',
        surname: 'User',
        role: 'user',
        role_id: 1,
        password: 'hashedpassword'
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findUserByUsername', () => {
        it('should return a user when found', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [mockUser] });

            const result = await findUserByUsername('testuser');

            expect(query).toHaveBeenCalledWith('SELECT * FROM users WHERE username = $1', ['testuser']);
            expect(result).toEqual({ ...mockUser, userId: mockUser.id });
        });

        it('should return undefined when user not found', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [] });

            const result = await findUserByUsername('nonexistentuser');

            expect(query).toHaveBeenCalledWith('SELECT * FROM users WHERE username = $1', ['nonexistentuser']);
            expect(result).toBeUndefined();
        });
    });

    describe('findUserByEmail', () => {
        it('should return a user when found', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [mockUser] });

            const result = await findUserByEmail('testuser@example.com');

            expect(query).toHaveBeenCalledWith(
                'SELECT id, username, email, name, surname, role, role_id FROM users WHERE email = $1',
                ['testuser@example.com']
            );
            expect(result).toEqual({ ...mockUser, userId: mockUser.id });
        });

        it('should return undefined when user not found', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [] });

            const result = await findUserByEmail('nonexistent@example.com');

            expect(query).toHaveBeenCalledWith(
                'SELECT id, username, email, name, surname, role, role_id FROM users WHERE email = $1',
                ['nonexistent@example.com']
            );
            expect(result).toBeUndefined();
        });
    });

    describe('findUserById', () => {
        it('should return a user when found', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [mockUser] });

            const result = await findUserById(1);

            expect(query).toHaveBeenCalledWith(
                'SELECT id, username, email, name, surname, role, role_id FROM users WHERE id = $1',
                [1]
            );
            expect(result).toEqual({ ...mockUser, userId: mockUser.id });
        });

        it('should return null when user not found', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [] });

            const result = await findUserById(999);

            expect(query).toHaveBeenCalledWith(
                'SELECT id, username, email, name, surname, role, role_id FROM users WHERE id = $1',
                [999]
            );
            expect(result).toBeNull();
        });
    });

    describe('getUserPasswordByEmail', () => {
        it('should return a password when user found', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [{ password: mockUser.password }] });

            const result = await getUserPasswordByEmail('testuser@example.com');

            expect(query).toHaveBeenCalledWith('SELECT password FROM users WHERE email = $1', ['testuser@example.com']);
            expect(result).toEqual(mockUser.password);
        });

        it('should return null when user not found', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [] });

            const result = await getUserPasswordByEmail('nonexistent@example.com');

            expect(query).toHaveBeenCalledWith('SELECT password FROM users WHERE email = $1', ['nonexistent@example.com']);
            expect(result).toBeNull();
        });

        it('should throw an error if database query fails', async () => {
            const mockError = new Error('Database error');
            (query as jest.Mock).mockRejectedValue(mockError);

            await expect(getUserPasswordByEmail('testuser@example.com')).rejects.toThrow('Database error');

            expect(query).toHaveBeenCalledWith('SELECT password FROM users WHERE email = $1', ['testuser@example.com']);
        });
    });
});
