import { query } from '../database';
import bcrypt from "bcrypt"; // Функция для выполнения запросов к БД

/**
 * Обновляет пароль пользователя в базе данных.
 *
 * @param {string} email Email пользователя, чей пароль обновляется.
 * @param {string} newPassword Новый пароль пользователя.
 */
export const updateUserPassword = async (email: string, newPassword: string): Promise<void> => {
    await query('UPDATE users SET password = $1 WHERE email = $2', [newPassword, email]);
};



/**
 * Изменяет пароль пользователя после проверки его текущего пароля.
 *
 * Эта функция сначала ищет пользователя по его ID и извлекает хэшированный пароль.
 * Затем она сравнивает предоставленный старый пароль с хэшем в базе данных,
 * используя bcrypt для безопасного сравнения. Если старый пароль подтверждается,
 * функция продолжает хешировать новый пароль и обновлять его в базе данных для соответствующего пользователя.
 *
 * @param {number} userId - Уникальный идентификатор пользователя, чей пароль нужно изменить.
 * @param {string} oldPassword - Текущий пароль пользователя, предоставленный для верификации.
 * @param {string} newPassword - Новый пароль, который пользователь хочет установить.
 *
 * @returns {Promise<boolean>} - Промис, который разрешается в значение true, если пароль успешно изменен,
 *                               или в значение false, если старый пароль не соответствует или пользователь не найден.
 */
export const changeUserPassword = async (userId: number, oldPassword: string, newPassword: string): Promise<boolean> => {
    // Пытаемся найти пользователя и его пароль в базе данных по userId
    const { rows } = await query('SELECT password FROM users WHERE id = $1', [userId]);
    if (rows.length === 0) {
        // Если пользователь не найден, возвращаем false
        return false;
    }

    const user = rows[0];
    // Сравниваем предоставленный старый пароль с хэшем в базе данных
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
        // Если старый пароль не соответствует, возвращаем false
        return false;
    }

    // Хешируем новый пароль перед сохранением
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    // Обновляем пароль в базе данных
    await query('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, userId]);

    // Возвращаем true, указывая на успешное изменение пароля
    return true;
};