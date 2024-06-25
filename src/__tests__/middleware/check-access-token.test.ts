import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import checkAccessToken from "../../middleware/check-access-token";

// Мокаем jwt
jest.mock('jsonwebtoken');

describe('checkAccessToken', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            headers: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        next = jest.fn();

        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return 401 if no token is provided', () => {
        checkAccessToken(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Access token is required');
    });

    it('should return 403 if token is expired', () => {
        req.headers!['authorization'] = 'Bearer expiredtoken';
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new jwt.TokenExpiredError('jwt expired', new Date());
        });

        checkAccessToken(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith('Invalid or expired token');
    });

    it('should return 403 if token is invalid', () => {
        req.headers!['authorization'] = 'Bearer invalidtoken';
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new jwt.JsonWebTokenError('jwt invalid');
        });

        checkAccessToken(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith('Invalid or expired token');
    });

    it('should call next if token is valid', () => {
        req.headers!['authorization'] = 'Bearer validtoken';
        (jwt.verify as jest.Mock).mockReturnValue({});

        checkAccessToken(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
    });
});
