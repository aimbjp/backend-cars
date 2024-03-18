import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Middleware для проверки наличия и валидности access токена в запросе, а также проверки
 * наличия у пользователя необходимых прав доступа. Токен ожидается в заголовке Authorization.
 *
 * @param {Request} req Объект запроса от express.
 * @param {Response} res Объект ответа от express.
 * @param {NextFunction} next Функция для передачи управления следующему middleware в стеке.
 */
export const checkAccessToken = (req: Request, res: Response, next: NextFunction) => {
    // Извлекаем токен из заголовка Authorization
    const token = req.headers['authorization']?.split(' ')[1];

    // Определяем требуемые права для доступа к ресурсу
    const requiredPermissions = ['aimbjpw@gmail.com'];

    // Проверяем наличие токена
    if (!token) {
        return res.status(401).send('Access token is required');
    }

    try {
        // Верифицируем токен и декодируем его payload
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;

        // Извлекаем права пользователя из payload токена
        const userPermissions = decoded.email || [];

        // Проверяем, имеет ли пользователь необходимые права доступа
        const hasAccess = requiredPermissions.every(email => userPermissions.includes(email));

        // Если у пользователя недостаточно прав, отправляем ошибку 403
        if (!hasAccess) {
            return res.status(403).send('Insufficient permissions');
        }

        // Если проверки пройдены успешно, передаем управление дальше
        next();
    } catch (error) {
        // В случае ошибки верификации токена (например, если он истек или невалиден),
        // отправляем ошибку 403
        return res.status(403).send('Invalid or expired token');
    }
};


/**
 * Извлекает userId из переданного JWT.
 *
 * @param token JWT строка.
 * @returns userId из токена или null, если токен невалидный или не содержит userId.
 */
export const getUserIdFromToken = (token: string): number | null => {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
        return decoded.id;
    } catch (error) {
        console.error('Ошибка при декодировании токена:', error);
        return null;
    }
};


