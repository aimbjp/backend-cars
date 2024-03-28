import { query } from '../database'; // Импортируем функцию для выполнения запросов к базе данных

/**
 * Находит пользователя по его имени пользователя.
 *
 * @param {string} username Имя пользователя для поиска.
 * @returns {Promise<Object | undefined>} Объект пользователя, если найден, иначе undefined.
 */
export const findUserByUsername = async (username: string) => {
    const { rows } = await query('SELECT * FROM users WHERE username = $1', [username]);
    return rows[0]; // Вернет пользователя, если найден, иначе undefined
};

/**
 * Находит пользователя по его электронной почте.
 *
 * @param {string} email Электронная почта пользователя для поиска.
 * @returns {Promise<Object | undefined>} Объект пользователя, если найден, иначе undefined.
 */
export const findUserByEmail = async (email: string) => {
    const { rows } = await query(
        'SELECT id AS "userId", username, email, name, surname, role FROM users WHERE email = $1',
        [email]);
    return rows[0]; // Вернет пользователя, если найден, иначе undefined
};

/**
 * Находит пользователя по его идентификатору.
 *
 * @param {number} userId Идентификатор пользователя для поиска.
 * @returns {Promise<Object | null>} Объект пользователя, если найден, иначе null.
 */
export const findUserById = async (userId: number): Promise<UserRegistered | null> => {
    try {
        const { rows } = await query('SELECT id, username, email, name, surname, role FROM users WHERE id = $1', [userId]);
        if (rows.length === 0) {
            return null; // Пользователь с таким ID не найден
        }
        return rows[0]; // Возвращаем первую строку, так как ID уникален
    } catch (err) {
        console.error('Error querying the database', err);
        throw err; // В случае ошибки при запросе к базе данных, перебрасываем исключение
    }
};


/**
 * Находит пароль пользователя по его адресу электронной почты.
 *
 * @param {string} email Адрес электронной почты пользователя для поиска.
 * @returns {Promise<string | null>} Пароль пользователя, если найден, иначе null.
 */
export const getUserPasswordByEmail = async (email: string): Promise<string | null> => {
    try {
        const { rows } = await query('SELECT password FROM users WHERE email = $1', [email]);
        if (rows.length === 0) {
            return null; // Пользователь с таким адресом электронной почты не найден
        }
        return rows[0].password; // Возвращаем пароль пользователя
    } catch (err) {
        console.error('Error querying the database', err);
        throw err; // В случае ошибки при запросе к базе данных, перебрасываем исключение
    }
};

