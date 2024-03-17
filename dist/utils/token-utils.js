"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const refresh_token_1 = require("../db/user/refresh-token");
/**
 * Генерирует access токен для пользователя.
 *
 * @param {User} user Объект пользователя, для которого генерируется токен.
 * @returns {string} Строка с сгенерированным JWT.
 */
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};
exports.generateAccessToken = generateAccessToken;
/**
 * Генерирует refresh токен для пользователя и сохраняет его в базе данных.
 *
 * @param {UserRegistered} user Объект пользователя, для которого генерируется токен.
 * @returns {Promise<string>} Промис, разрешающийся в строку с сгенерированным refresh токеном.
 * @throws {Error} Если переменная окружения REFRESH_TOKEN_SECRET не определена.
 */
const generateRefreshToken = async (user) => {
    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error('REFRESH_TOKEN_SECRET is not defined');
    }
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user.userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    // expiresIn для refresh токена - 7 дней в секундах
    const expiresIn = 7 * 24 * 60 * 60;
    await (0, refresh_token_1.saveRefreshToken)(user.userId, refreshToken, expiresIn);
    return refreshToken;
};
exports.generateRefreshToken = generateRefreshToken;
/**
 * Верифицирует refresh токен и возвращает данные пользователя, если токен валиден.
 *
 * @param {string} token Токен для верификации.
 * @returns {UserRegistered | null} Объект с данными пользователя или null, если токен невалиден.
 */
const verifyRefreshToken = (token) => {
    try {
        const userData = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
        return userData;
    }
    catch (err) {
        return null; // В случае ошибки при верификации возвращается null
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
