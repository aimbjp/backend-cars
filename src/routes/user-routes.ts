import { Router } from 'express';
import {checkAccessToken} from "../middleware/auth-middleware";
import {getUserByIdController, updateUserController} from "../controllers/user/user-controller";
import {changePasswordController} from "../controllers/auth/auth-controller";

const userRoutes = Router();

// Маршрут для получения информации о пользователе по ID
userRoutes.get('/:id', checkAccessToken, getUserByIdController);

// Маршрут для обновления данных пользователя
userRoutes.patch('/:id', checkAccessToken, updateUserController);

userRoutes.post('/change-password', checkAccessToken, changePasswordController);

// example: router.post('/token', checkAccessToken, authController.refreshToken);

export default userRoutes;
