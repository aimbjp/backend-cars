import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {checkAccessToken, getUserIdFromToken} from "../../middleware/auth-middleware";

enum ROLES {
    user = 1, moderator = 2, admin = 3
}

// Мокаем jwt
jest.mock('jsonwebtoken');

describe('authMiddleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            headers: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();

        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('checkAccessToken', () => {
        it('should return 401 if no token is provided', () => {
            checkAccessToken(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Access token is required' });
        });

        it('should return 401 if token is expired', () => {
            req.headers!['authorization'] = 'Bearer expiredtoken';
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new jwt.TokenExpiredError('jwt expired', new Date());
            });

            checkAccessToken(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'jwt expired', errorDescription: 'JWT token has expired' });
        });

        it('should return 403 if token is invalid', () => {
            req.headers!['authorization'] = 'Bearer invalidtoken';
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new jwt.JsonWebTokenError('jwt invalid');
            });

            checkAccessToken(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'jwt invalid', errorDescription: 'JWT token is invalid' });
        });

        it('should return 403 if user does not have required permissions', () => {
            req.headers!['authorization'] = 'Bearer validtoken';
            (jwt.verify as jest.Mock).mockReturnValue({ role_id: [ROLES.moderator] });

            checkAccessToken(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'Insufficient permissions' });
        });

        it('should call next if token is valid and user has required permissions', () => {
            req.headers!['authorization'] = 'Bearer validtoken';
            (jwt.verify as jest.Mock).mockReturnValue({ role_id: [ROLES.user] });

            checkAccessToken(req as Request, res as Response, next);

            expect(next).toHaveBeenCalled();
        });

        it('should handle unexpected errors', () => {
            req.headers!['authorization'] = 'Bearer token';
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error('Unexpected error');
            });

            checkAccessToken(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error', errorDescription: 'An unexpected error occurred' });
        });
    });

    describe('getUserIdFromToken', () => {
        it('should return userId if token is valid', () => {
            (jwt.verify as jest.Mock).mockReturnValue({ userId: 1 });

            const result = getUserIdFromToken('validtoken');

            expect(result).toBe(1);
        });

        it('should return null if token is invalid', () => {
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new jwt.JsonWebTokenError('jwt invalid');
            });

            const result = getUserIdFromToken('invalidtoken');

            expect(result).toBeNull();
        });

        it('should return null if token is expired', () => {
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new jwt.TokenExpiredError('jwt expired', new Date());
            });

            const result = getUserIdFromToken('expiredtoken');

            expect(result).toBeNull();
        });

        it('should return null if an unexpected error occurs', () => {
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error('Unexpected error');
            });

            const result = getUserIdFromToken('token');

            expect(result).toBeNull();
        });
    });
});
