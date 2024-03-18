import { Router } from 'express';
import * as authController from '../controllers/auth/auth-controller';

const authRoutes = Router();

authRoutes.post('/register', authController.register);
authRoutes.post('/login', authController.login);
authRoutes.post('/token', authController.refreshToken);
authRoutes.post('/request-password-reset', authController.requestPasswordReset);
authRoutes.post('/reset-password', authController.resetPassword);

// example: router.post('/token', checkAccessToken, authController.refreshToken);

export default authRoutes;
