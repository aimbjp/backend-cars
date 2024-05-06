import jwt from 'jsonwebtoken';
import { saveRefreshToken } from "../db/user/refresh-token";
import crypto from 'crypto';
import {query} from "../db/connection/database";

/**
 * Генерирует access токен для пользователя.
 *
 * @param {User} user Объект пользователя, для которого генерируется токен.
 * @returns {string} Строка с сгенерированным JWT.
 */
export const generateAccessToken = (user: User): string => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
};

/**
 * Генерирует refresh токен для пользователя и сохраняет его в базе данных.
 *
 * @param {UserRegistered} user Объект пользователя, для которого генерируется токен.
 * @returns {Promise<string>} Промис, разрешающийся в строку с сгенерированным refresh токеном.
 * @throws {Error} Если переменная окружения REFRESH_TOKEN_SECRET не определена.
 */
export const generateRefreshToken = async (user: UserRegistered): Promise<string> => {
    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error('REFRESH_TOKEN_SECRET is not defined');
    }

    const refreshToken = jwt.sign({ userId: user.userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // expiresIn для refresh токена - 7 дней в секундах
    const expiresIn = 7 * 24 * 60 * 60;

    await saveRefreshToken(user.userId, refreshToken, expiresIn);

    return refreshToken;
};

/**
 * Верифицирует refresh токен и возвращает данные пользователя, если токен валиден.
 *
 * @param {string} token Токен для верификации.
 * @returns {UserRegistered | null} Объект с данными пользователя или null, если токен невалиден.
 */
export const verifyRefreshToken = (token: string): UserRegistered | null => {
    try {
        const userData = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as UserRegistered;
        return userData;
    } catch (err) {
        return null; // В случае ошибки при верификации возвращается null
    }
};

/**
 * Генерирует уникальный код восстановления пароля, сохраняет его в базе данных и возвращает.
 *
 * @param {string} email Email пользователя, для которого генерируется код.
 * @returns {Promise<string>} Сгенерированный код восстановления.
 */
export const generateResetToken = async (email: string): Promise<string> => {
    const resetToken = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 час на восстановление
    await query('INSERT INTO password_reset_tokens (email, token, expires_at) VALUES ($1, $2, $3)', [email, resetToken, expiresAt]);
    return resetToken;
};

/**
 * Проверяет валидность токена восстановления пароля для данного email.
 * Проверяет, существует ли токен и не истек ли его срок действия.
 *
 * @param email Email пользователя, для которого проверяется токен.
 * @param token Токен восстановления пароля, который нужно проверить.
 * @returns {Promise<boolean>} Возвращает true, если токен валиден, иначе false.
 */
export const verifyResetToken = async (token: string): Promise<boolean> => {
    const { rows } = await query('SELECT * FROM password_reset_tokens WHERE token = $1', [token]);
    const tokenRecord = rows[0];


    if (!tokenRecord) {
        // Токен не найден
        return false;
    }

    const isExpired = new Date() > new Date(tokenRecord.expires_at);
    if (isExpired) {
        // Токен истек
        return false;
    }

    return true;
};


/**
 * Удаляет токен сброса пароля из базы данных.
 *
 * @param email Email пользователя, для которого выполняется сброс пароля.
 * @param token Токен сброса пароля, который нужно удалить.
 */
export const deleteResetToken = async (token: string): Promise<void> => {
    try {
        await query('DELETE FROM password_reset_tokens WHERE token = $1', [token]);
    } catch (error) {
        console.error(`Error deleting reset token = ${token}:`, error);
        throw error;
    }
};


// Проверка валидности access токена
export const verifyAccessToken = (token: string): UserRegistered | null => {
    try {
        const userData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as UserRegistered;
        return userData;
    } catch (err) {
        return null; // В случае ошибки при верификации возвращается null
    }
};
