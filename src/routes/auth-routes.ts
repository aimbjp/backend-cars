import { Router } from 'express';
import * as authController from '../controllers/auth/auth-controller';
import checkAccessToken from "../middleware/auth-middleware";

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/token', authController.refreshToken);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

// example: router.post('/token', checkAccessToken, authController.refreshToken);

export default router;
