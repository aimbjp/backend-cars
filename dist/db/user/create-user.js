"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const database_1 = require("../database"); // Предположим, что у вас есть функция для выполнения запросов к базе данных
/**
 * Создает нового пользователя в базе данных.
 * Вставляет в таблицу users значения username, password, email, name и surname.
 * Возвращает созданного пользователя, исключая его пароль из ответа для безопасности.
 *
 * @param {Object} user Данные пользователя.
 * @param {string} user.username Имя пользователя.
 * @param {string} user.password Хешированный пароль пользователя.
 * @param {string} user.email Электронная почта пользователя.
 * @param {string} user.name Имя пользователя (не обязательно).
 * @param {string} user.surname Фамилия пользователя (не обязательно).
 * @returns {Promise<Object>} Объект пользователя, содержащий id, username, email, name, surname.
 * @throws {Error} В случае ошибки выполнения запроса к базе данных.
 */
const createUser = async ({ username, password, email, name, surname }) => {
    try {
        // Выполнение SQL-запроса на вставку нового пользователя в таблицу users
        // и возвращение его id, username, email, name, surname
        const { rows } = await (0, database_1.query)('INSERT INTO users (username, password, email, name, surname) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, name, surname', [username, password, email, name, surname]);
        // Возвращаем данные созданного пользователя
        return rows[0];
    }
    catch (error) {
        // Логирование ошибки и выбрасывание исключения для обработки на более высоком уровне
        console.error('Error creating new user:', error);
        throw new Error(error.message);
    }
};
exports.createUser = createUser;
