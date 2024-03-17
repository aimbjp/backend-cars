import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { createUser } from "../../db/user/create-user";
import {findUserByEmail, findUserById} from "../../db/user/find-user";
import {
    generateAccessToken,
    generateRefreshToken,
    generateResetToken,
    verifyRefreshToken, verifyResetToken
} from "../../services/token-utils";
import {removeRefreshToken} from "../../db/user/refresh-token";
import {updateUserPassword} from "../../db/user/reset-password";
import {sendResetEmail} from "../../services/email-service";


/**
 * Регистрирует нового пользователя в системе.
 *
 * @param req Запрос от клиента, содержащий данные пользователя.
 * @param res Ответ сервера.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password, email, name, surname } = req.body;

        if (!email || !password) {
            res.status(400).send('Email and password are required');
            return;
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            res.status(409).send('Email is already in use');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser({ username, password: hashedPassword, email, name, surname });

        const accessToken = generateAccessToken(newUser);
        const refreshToken = await generateRefreshToken(newUser);

        res.status(201).json({
            message: 'User created successfully',
            user: newUser,
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering new user');
    }
};

/**
 * Аутентифицирует пользователя и выдает access и refresh токены.
 *
 * @param req Запрос от клиента, содержащий email и пароль пользователя.
 * @param res Ответ сервера.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);

        res.json({
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email, name: user.name, surname: user.surname, username: user.username }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Обновляет access токен, используя refresh токен.
 *
 * @param req Запрос от клиента, содержащий refresh токен.
 * @param res Ответ сервера.
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        res.status(401).json({ message: 'Refresh token is required' });
        return;
    }

    const userData = verifyRefreshToken(refreshToken);
    if (!userData) {
        res.status(403).json({ message: 'Invalid refresh token' });
        return;
    }

    const user = await findUserById(userData.userId);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
};

/**
 * Выход пользователя из системы, инвалидирует refresh токен.
 *
 * @param req Запрос от клиента, содержащий refresh токен.
 * @param res Ответ сервера.
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        res.status(400).send('Refresh token is required');
        return;
    }

    const userData = verifyRefreshToken(refreshToken);
    if (!userData) {
        res.status(403).send('Invalid refresh token');
        return;
    }

    try {
        await removeRefreshToken(refreshToken);
        res.send('User logged out successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};

/**
 * Инициирует процесс восстановления пароля, отправляя пользователю письмо с кодом восстановления.
 *
 * @param {Request} req Запрос от клиента, содержащий email пользователя.
 * @param {Response} res Ответ сервера.
 */
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    if (!email) {
        res.status(400).send('Email is required');
        return;
    }

    const token = await generateResetToken(email);
    await sendResetEmail(email, token);
    res.send('Reset email sent');
};

/**
 * Выполняет восстановление пароля пользователя, обновляя его пароль в базе данных.
 *
 * @param {Request} req Запрос от клиента, содержащий код восстановления и новый пароль.
 * @param {Response} res Ответ сервера.
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { email, token, newPassword } = req.body;

    // Проверяем валидность токена
    const isValidToken = await verifyResetToken(email, token);
    if (!isValidToken) {
        res.status(400).send('Invalid or expired reset token');
        return;
    }

    // Токен валиден, обновляем пароль пользователя
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(email, hashedPassword);
    res.send('Password has been reset successfully');
};