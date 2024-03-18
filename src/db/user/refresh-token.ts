import { query } from '../database';

/**
 * Сохраняет refresh токен для пользователя в базе данных с ограничением на количество активных сессий.
 * Если количество сессий для пользователя превышает установленный лимит, самые старые токены удаляются.
 *
 * @param userId Идентификатор пользователя, для которого сохраняется токен.
 * @param token Значение refresh токена, которое нужно сохранить.
 * @param expiresIn Время жизни токена в секундах.
 */
export const saveRefreshToken = async (userId: number, token: string, expiresIn: number): Promise<void> => {
    // Преобразование секунд в миллисекунды для вычисления даты истечения срока действия токена
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    // Установленный лимит на количество активных сессий для пользователя
    const maxSessions = 3;

    try {
        // Получение всех токенов пользователя, отсортированных по дате истечения
        const { rows } = await query('SELECT token_id FROM refresh_tokens WHERE user_id = $1 ORDER BY expires_at ASC', [userId]);

        // Проверка на превышение лимита сессий
        if (rows.length >= maxSessions) {
            // Вычисление количества токенов, которые необходимо удалить
            const tokensToDelete = rows.length - maxSessions + 1;

            // Получение ID токенов для удаления
            const oldestTokenIds = rows.slice(0, tokensToDelete).map(row => row.token_id);

            // Удаление самых старых токенов
            await query('DELETE FROM refresh_tokens WHERE token_id = ANY($1::int[])', [oldestTokenIds]);
        }

        // Добавление нового токена в базу данных
        await query('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)', [userId, token, expiresAt]);
    } catch (error) {
        console.error('Error saving or updating refresh token:', error);
        throw error; // Перебрасываем ошибку для дальнейшей обработки
    }
};

/**
 * Удаляет refresh токен из базы данных.
 * @param refreshToken Значение refresh токена, который нужно удалить.
 */
export const removeRefreshToken = async (refreshToken: string): Promise<void> => {
    const deleteQuery = 'DELETE FROM refresh_tokens WHERE token = $1';

    try {
        const result = await query(deleteQuery, [refreshToken]);
        console.log(`Removed ${result.rowCount} refresh token(s).`);
    } catch (error) {
        console.error('Error occurred during refresh token removal:', error);
        throw error;
    }
};

/**
 * Проверяет наличие refresh токена в базе данных.
 *
 * @param refreshToken Строка, содержащая refresh токен, который необходимо найти.
 * @returns Возвращает промис, разрешающийся в true, если токен найден, и в false, если нет.
 */
export const findRefreshToken = async (refreshToken: string): Promise<boolean> => {
    const findQuery = 'SELECT 1 FROM refresh_tokens WHERE token = $1'

    try {
        const { rows } = await query(findQuery, [refreshToken]);
        return rows.length > 0;
    } catch (error) {
        console.error('Error occurred during refresh token removal:', error);
        return false;
    }

}