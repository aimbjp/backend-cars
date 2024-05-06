import {getAllUsers} from "../controllers/users/users-controller";
import {checkAccessToken} from "../middleware/auth-middleware";
import {Router} from "express";

const usersRoutes = Router();

const USERS: '/users' = '/users';

usersRoutes.get(USERS + '/users', checkAccessToken, getAllUsers);

export default usersRoutes;
