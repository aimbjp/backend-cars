import { Router } from 'express';
import {checkAccessToken} from "../middleware/auth-middleware";
import {getUserByIdController, updateUserController} from "../controllers/profile/user-controller";
import {changePasswordController} from "../controllers/auth/auth-controller";

const profileRoutes = Router();

const USER: '/user' = '/user';


// Маршрут для получения информации о пользователе по ID
profileRoutes.get(USER + '/', checkAccessToken, getUserByIdController);

// Маршрут для обновления данных пользователя
profileRoutes.patch( USER + '/', checkAccessToken, updateUserController);

profileRoutes.post(USER + '/change-password', checkAccessToken, changePasswordController);

// example: router.post('/token', checkAccessToken, authController.refreshToken);

export default profileRoutes;
