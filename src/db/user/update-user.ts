import { query } from '../database'; // Функция для выполнения запросов к БД

/**
 * Обновляет информацию о пользователе в базе данных.
 *
 * Эта функция динамически строит SQL-запрос для обновления только тех полей
 * пользователя, которые были переданы в объекте `user`. `userId` используется
 * для идентификации пользователя, а остальные поля в `user` указывают на то,
 * какие данные необходимо обновить. Функция не обновляет пароль пользователя
 * и не возвращает его в ответе.
 *
 * @param user Объект, содержащий `userId` и обновляемые поля пользователя.
 *             Допускается передача частичного объекта пользователя.
 * @returns Возвращает промис, который разрешается в обновленный объект пользователя
 *          без поля пароля, или `null`, если пользователя не найдено.
 */
export const updateUser = async (user: Partial<UserRegistered>): Promise<UserRegistered | null> => {
    //TODO: add checking for username same and for email same
    let queryText = 'UPDATE users SET ';
    const queryParams = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(user)) {
        if (value !== undefined && key !== 'userId' && key !== 'password') { // Исключаем userId и password из обновляемых полей
            if (paramIndex > 1) queryText += ", ";
            queryText += `${key} = $${paramIndex}`;
            queryParams.push(value);
            paramIndex++;
        }
    }

    if (paramIndex === 1) {
        console.error("No fields provided for update");
        return null;
    }

    queryText += ` WHERE id = $${paramIndex} RETURNING *`; // Обновляем по id, возвращаем обновленные данные
    queryParams.push(user.userId);

    try {
        const { rows } = await query(queryText, queryParams);
        if (rows.length > 0) {
            const { password, ...updatedUser } = rows[0]; // Исключаем пароль из возвращаемых данных
            return updatedUser;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Ошибка при обновлении пользователя:', error);
        throw error;
    }
};
