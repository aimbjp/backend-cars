import { Request, Response } from 'express';
import * as tokenUtils from '../utils/token-utils';
import bcrypt from 'bcrypt';
import { createUser } from "../db/user/create-user";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        // Проверка на наличие username и password
        if (!username || !password) {
            res.status(400).send('Username and password are required');
            return;
        }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создание пользователя
        const user = await createUser({ username, password: hashedPassword });

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering new user');
    }
};

export const login = (req: Request, res: Response): void => {
    // Логика логина пользователя и выдачи токенов
};

export const refreshToken = (req: Request, res: Response): void => {
    // Логика обновления access токена с использованием refresh токена
};
