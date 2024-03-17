import { query } from '../database'; // Функция для выполнения запросов к БД

/**
 * Обновляет пароль пользователя в базе данных.
 *
 * @param {string} email Email пользователя, чей пароль обновляется.
 * @param {string} newPassword Новый пароль пользователя.
 */
export const updateUserPassword = async (email: string, newPassword: string): Promise<void> => {
    await query('UPDATE users SET password = $1 WHERE email = $2', [newPassword, email]);
};