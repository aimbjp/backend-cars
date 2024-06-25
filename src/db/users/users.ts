import {query} from "../connection/database";

export const getUsersFromDB = async () => {
    try {
        const usersQuery = 'SELECT id as "userId", email, username, name FROM users;';
        const users = await query(usersQuery);
        return users.rows;
    } catch (error: any) {
        console.error('Error get users from DB:', error);
        throw new Error(error.message);
    }
};

