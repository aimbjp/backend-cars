import { query } from '../database';

interface User {
    username: string;
    password: string; // Хешированный пароль
}

export const createUser = async ({ username, password }: User): Promise<User> => {
    try {
        const { rows } = await query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, password]
        );
        return rows[0];
    } catch (error: any) {
        throw new Error(error.message);
    }
};