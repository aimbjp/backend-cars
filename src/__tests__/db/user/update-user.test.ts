import { updateUser } from '../../../db/user/update-user';
import { query } from '../../../db/connection/database';

// Мокируем зависимость query
jest.mock('../../../db/connection/database', () => ({
    query: jest.fn(),
}));

describe('updateUser', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update the user with the provided fields and return the updated user without password', async () => {
        const mockUser = {
            userId: 1,
            email: 'updated@example.com',
            name: 'UpdatedName',
        };

        const updatedUserFromDb = {
            id: 1,
            email: 'updated@example.com',
            username: 'johndoe',
            name: 'UpdatedName',
            surname: 'Doe',
            role: 'user',
            role_id: 1,
            createdAt: new Date(),
            rating: 5.0,
            contact_info_id: 1,
        };

        (query as jest.Mock).mockResolvedValueOnce({ rows: [updatedUserFromDb] });

        const result = await updateUser(mockUser);

        expect(query).toHaveBeenCalledWith(
            'UPDATE users SET email = $1, name = $2 WHERE id = $3 RETURNING *',
            ['updated@example.com', 'UpdatedName', 1]
        );

        const { ...expectedUser } = updatedUserFromDb;
        expect(result).toEqual(expectedUser);
    });

    it('should return null if no fields are provided for update', async () => {
        const mockUser = { userId: 1 };

        const result = await updateUser(mockUser);

        expect(result).toBeNull();
        expect(query).not.toHaveBeenCalled();
    });

    it('should return null if the user is not found', async () => {
        const mockUser = {
            userId: 1,
            email: 'updated@example.com',
            name: 'UpdatedName',
        };

        (query as jest.Mock).mockResolvedValueOnce({ rows: [] });

        const result = await updateUser(mockUser);

        expect(query).toHaveBeenCalledWith(
            'UPDATE users SET email = $1, name = $2 WHERE id = $3 RETURNING *',
            ['updated@example.com', 'UpdatedName', 1]
        );

        expect(result).toBeNull();
    });

    it('should throw an error if the query fails', async () => {
        const mockUser = {
            userId: 1,
            email: 'updated@example.com',
            name: 'UpdatedName',
        };

        const mockError = new Error('Database error');

        (query as jest.Mock).mockRejectedValueOnce(mockError);

        await expect(updateUser(mockUser)).rejects.toThrow('Database error');

        expect(query).toHaveBeenCalledWith(
            'UPDATE users SET email = $1, name = $2 WHERE id = $3 RETURNING *',
            ['updated@example.com', 'UpdatedName', 1]
        );
    });
});
