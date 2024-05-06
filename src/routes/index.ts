import { Router } from 'express';
import authRoutes from './auth-routes';
import profileRoutes from './profile-routes';
import usersRoutes from "./users-routes";
import carsRouter from "./car-routes";

const router = Router();

router.use(authRoutes);

router.use(profileRoutes);

router.use(usersRoutes);

router.use(carsRouter);


export default router;