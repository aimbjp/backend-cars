import { Router } from 'express';
import authRoutes from './auth-routes';
import userRoutes from './user-routes';

const router = Router();

// Импорт и использование маршрутов аутентификации
router.use(authRoutes);

// Импорт и использование маршрутов пользователя
router.use(userRoutes);

export default router;