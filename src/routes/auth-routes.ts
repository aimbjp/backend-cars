import { Router } from 'express';
import * as authController from '../controllers/auth/auth-controller';

const authRoutes = Router();

const AUTH: '/auth' = '/auth';

authRoutes.post(AUTH + '/register', authController.register);
authRoutes.post(AUTH + '/login', authController.login);
authRoutes.post(AUTH + '/token', authController.refreshToken);
authRoutes.post(AUTH + '/request-password-reset', authController.requestPasswordReset);
authRoutes.post(AUTH + '/reset-password', authController.resetPassword);
authRoutes.post(AUTH + '/logout', authController.logout);

export default authRoutes;
