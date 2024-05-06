import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

enum ROLES {
    user = 1,  moderator = 2, admin = 3
}

/**
 * Middleware для проверки наличия и валидности access токена в запросе, а также проверки
 * наличия у пользователя необходимых прав доступа. Токен ожидается в заголовке Authorization.
 *
 * @param {Request} req Объект запроса от express.
 * @param {Response} res Объект ответа от express.
 * @param {NextFunction} next Функция для передачи управления следующему middleware в стеке.
 */
export const checkAccessToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;

        const userPermissions = Array.isArray(decoded.role_id) ? decoded.role_id : [decoded.role_id];
        const requiredPermissions = [ROLES.user];
        const hasAccess = requiredPermissions.every(role_id => userPermissions.includes(role_id));


        if (!hasAccess) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    } catch (error) {
        // Если ошибка связана с истечением срока действия токена
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'jwt expired', errorDescription: 'JWT token has expired' });
        }
        // Если ошибка верификации (невалидный, подделанный и т.д.)
        else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ error: 'jwt invalid', errorDescription: 'JWT token is invalid' });
        }
        // Обработка других ошибок
        else {
            return res.status(500).json({ error: 'Internal Server Error', errorDescription: 'An unexpected error occurred' });
        }
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
        return decoded.userId;
    } catch (error) {
        console.error('Ошибка при декодировании токена:', error);
        return null;
    }
};


