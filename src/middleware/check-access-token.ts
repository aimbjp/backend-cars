import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const checkAccessToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        res.status(401).send('Access token is required');
        return;
    }

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
        next();
    } catch (error) {
        res.status(403).send('Invalid or expired token');
        return;
    }
};

export default checkAccessToken;
