import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { createUser } from "../../db/user/create-user";
import {findUserByEmail, findUserById, findUserByUsername, getUserPasswordByEmail} from "../../db/user/find-user";
import {
    deleteResetToken,
    generateAccessToken,
    generateRefreshToken,
    generateResetToken,
    verifyRefreshToken, verifyResetToken
} from "../../services/token-utils";
import {findRefreshToken, removeRefreshToken} from "../../db/user/refresh-token";
import {changeUserPassword, getUserEmailByToken, updateUserPassword} from "../../db/user/reset-password";
import {sendResetEmail} from "../../services/email-service";
import {getUserIdFromToken} from "../../middleware/auth-middleware";


/**
 * Регистрирует нового пользователя в системе.
 *
 * @param req Запрос от клиента, содержащий данные пользователя.
 * @param res Ответ сервера.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password, email, name, surname } = req.body;

        if (!email || !password || !username) {
            res.status(400).send({success: false, message: 'Email, username and password are required'});
            return;
        }

        // Проверка валидности email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).send({ success: false, message: "Invalid email format" });
            return;
        }

        const existingUserEmail = await findUserByEmail(email);
        const existingUserUsername = username && await findUserByUsername(username);

        if (existingUserEmail) {
            res.status(409).send({success: false, message: 'Email is already in use'});
            return;
        }

        if (existingUserUsername) {
            res.status(409).send({success: false, message: 'Username is already in use'});
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser({ username, password: hashedPassword, email, name, surname });

        const accessToken = generateAccessToken(newUser);
        const refreshToken = await generateRefreshToken(newUser);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: newUser,
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({success: false, message: 'Error registering new user'});
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
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const realPassword: string = await getUserPasswordByEmail(user.email) || '';

        const isValidPassword = await bcrypt.compare(password, realPassword);
        if (!isValidPassword) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);

        res.json({
            success: true,
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email, name: user.name, surname: user.surname, username: user.username }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

/**
 * Обновляет access токен, используя refresh токен.
 *
 * @param req Запрос от клиента, содержащий refresh токен.
 * @param res Ответ сервера.
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(401).json({ success: false, message: 'Refresh token is required' });
            return;
        }

        const userData = verifyRefreshToken(refreshToken);
        const refreshTokenExist = await findRefreshToken(refreshToken);
        if (!userData || !refreshTokenExist) {
            res.status(403).json({ success: false, message: 'Invalid refresh token' });
            return;
        }

        const user = await findUserById(userData.userId);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const newAccessToken = generateAccessToken(user);
        res.status(200).json({ success: true, accessToken: newAccessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


/**
 * Выход пользователя из системы, инвалидирует refresh токен.
 *
 * @param req Запрос от клиента, содержащий refresh токен.
 * @param res Ответ сервера.
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(400).send({ success: false, message: 'Refresh token is required' });
            return;
        }

        const userData = verifyRefreshToken(refreshToken);
        if (!userData) {
            res.status(403).send({ success: false, message: 'Invalid refresh token' });
            return;
        }

        await removeRefreshToken(refreshToken);
        res.json({ success: true, message: 'User logged out successfully' });
    } catch (err) {
        console.error('Error during logout:', err);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
};


/**
 * Инициирует процесс восстановления пароля, отправляя пользователю письмо с кодом восстановления.
 *
 * @param {Request} req Запрос от клиента, содержащий email пользователя.
 * @param {Response} res Ответ сервера.
 */
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).send({success: false, message: 'Email is required'});
            return;
        }
        const existingUserEmail = await findUserByEmail(email);
        if (!existingUserEmail) {
            res.status(400).send({success: false, message: 'This user is not registered'});
            return;
        }

        const token = await generateResetToken(email);
        await sendResetEmail(email, token);
        res.send({success: true, message: 'Reset email sent'});
    } catch (error) {
        console.error('Error during password reset request:', error);
        res.status(500).send({success: false, message: 'Internal server error'});
    }
};


/**
 * Выполняет восстановление пароля пользователя, обновляя его пароль в базе данных.
 *
 * @param {Request} req Запрос от клиента, содержащий код восстановления и новый пароль.
 * @param {Response} res Ответ сервера.
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, password } = req.body;

        // Проверяем валидность токена
        const isValidToken = await verifyResetToken(token);
        const email = await getUserEmailByToken(token) || '';
        if (!isValidToken || email == '') {
            res.status(400).send({success: false, message: 'Invalid or expired reset token'});
            return;
        }

        // Токен валиден, обновляем пароль пользователя
        const hashedPassword = await bcrypt.hash(password, 10);
        await updateUserPassword(email, hashedPassword);
        deleteResetToken(token);
        res.send({success: true, message: 'Password has been reset successfully'});
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).send({success: false, message: 'Internal server error'});
    }
};



/**
 * Контроллер для обработки запроса на изменение пароля пользователя.
 * Эта функция извлекает и верифицирует JWT из заголовка `Authorization` запроса,
 * чтобы идентифицировать пользователя, который пытается изменить свой пароль.
 *
 * После успешной верификации токена функция извлекает из тела запроса старый и новый пароли.
 * Старый пароль сравнивается с хэшем пароля в базе данных для проверки,
 * что пользователь действительно владеет текущим паролем.
 *
 * Если проверка пройдена успешно, новый пароль хешируется и обновляется в базе данных.
 *
 * @param {Request} req - Объект запроса от клиента. Ожидается, что он содержит заголовок `Authorization`
 *                        с JWT и тело с полями `oldPassword` и `newPassword`.
 * @param {Response} res - Объект ответа сервера.
 *
 * Возвращает сообщение об успешном обновлении пароля или ошибку в случае неверного старого пароля,
 * проблем с аутентификацией или других ошибок обработки запроса.
 */
export const changePasswordController = async (req: Request, res: Response) => {
    try {
        // Извлечение токена из заголовков
        const token = req.headers.authorization?.split(' ')[1];
        // Получение userId из токена
        const userId = token ? getUserIdFromToken(token) : null;

        // Проверка на наличие userId из токена
        if (!userId) {
            return res.status(403).send({ success: false, message: 'Access denied.' });
        }

        // Извлечение старого и нового паролей из тела запроса
        const { oldPassword, newPassword } = req.body;
        // Вызов сервиса для изменения пароля
        const result = await changeUserPassword(userId, oldPassword, newPassword);

        // Отправка соответствующего ответа в зависимости от результата операции
        if (result) {
            res.send({ success: true, message: 'Password successfully updated.' });
        } else {
            res.status(400).send({ success: false, message: 'Could not update password.' });
        }
    } catch (error) {
        console.error('Error during password change:', error);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
};



