"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const database_1 = require("../database");
const createUser = async ({ username, password }) => {
    try {
        const { rows } = await (0, database_1.query)('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, password]);
        return rows[0];
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.createUser = createUser;
