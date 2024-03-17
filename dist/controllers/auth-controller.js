"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const create_user_1 = require("../db/user/create-user");
const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Проверка на наличие username и password
        if (!username || !password) {
            res.status(400).send('Username and password are required');
            return;
        }
        // Хеширование пароля
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Создание пользователя
        const user = await (0, create_user_1.createUser)({ username, password: hashedPassword });
        res.status(201).json({ message: 'User created successfully', user });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error registering new user');
    }
};
exports.register = register;
const login = (req, res) => {
    // Логика логина пользователя и выдачи токенов
};
exports.login = login;
const refreshToken = (req, res) => {
    // Логика обновления access токена с использованием refresh токена
};
exports.refreshToken = refreshToken;
