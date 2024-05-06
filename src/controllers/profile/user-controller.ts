import { Request, Response } from 'express';

import {findUserById} from "../../db/user/find-user";
import {updateUser} from "../../db/user/update-user";
import {getUserIdFromToken} from "../../middleware/auth-middleware";
/**
 * Получает пользователя по ID.
 *
 * @param req Запрос от клиента.
 * @param res Ответ сервера.
 */
export const getUserByIdController = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send({success: false, message: 'Authorization token is missing.'});
    }

    const id = await getUserIdFromToken(token) || -1;
    const user = await findUserById(id);
    if (user) {
        res.json({success: true, user: user});
    } else {
        res.status(404).send({success: false, message: 'User not found'});
    }
};

/**
 * Обновляет данные пользователя, используя ID, извлеченный из токена доступа.
 *
 * @param req Запрос от клиента.
 * @param res Ответ сервера.
 */
export const updateUserController = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).send({success: false, message: 'Authorization token is missing.'});
        }

        const userId = getUserIdFromToken(token);
        if (!userId) {
            return res.status(403).send({success: false, message: 'Invalid token or token does not contain user ID.'});
        }

        const updatedUser = await updateUser({ ...req.body, userId });
        res.json({success: true, user: updatedUser});
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send({success: false, message: 'Internal Server Error'});
    }
};
