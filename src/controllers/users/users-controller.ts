import {Request, Response} from "express";
import {getUsersFromDB} from "../../db/users/users";


export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getUsersFromDB();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

