import { Router } from 'express';
import * as authController from '../controllers/auth/auth-controller';

const authRoutes = Router();

const AUTH: '/auth' = '/auth';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user with the provided credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input data
 */
authRoutes.post(AUTH + '/register', authController.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Logs in a user with username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */
authRoutes.post(AUTH + '/login', authController.login);
authRoutes.post(AUTH + '/token', authController.refreshToken);
authRoutes.post(AUTH + '/request-password-reset', authController.requestPasswordReset);
authRoutes.post(AUTH + '/reset-password', authController.resetPassword);
authRoutes.post(AUTH + '/logout', authController.logout);

export default authRoutes;
