"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Middleware для проверки наличия и валидности access токена в запросе, а также проверки
 * наличия у пользователя необходимых прав доступа. Токен ожидается в заголовке Authorization.
 *
 * @param {Request} req Объект запроса от express.
 * @param {Response} res Объект ответа от express.
 * @param {NextFunction} next Функция для передачи управления следующему middleware в стеке.
 */
const checkAccessToken = (req, res, next) => {
    var _a;
    // Извлекаем токен из заголовка Authorization
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    // Определяем требуемые права для доступа к ресурсу
    const requiredPermissions = ['aimbjpw@gmail.com'];
    // Проверяем наличие токена
    if (!token) {
        return res.status(401).send('Access token is required');
    }
    try {
        // Верифицируем токен и декодируем его payload
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
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
    }
    catch (error) {
        // В случае ошибки верификации токена (например, если он истек или невалиден),
        // отправляем ошибку 403
        return res.status(403).send('Invalid or expired token');
    }
};
exports.default = checkAccessToken;
