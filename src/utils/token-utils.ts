import jwt from 'jsonwebtoken';

interface UserPayload {
    username: string;
}

export const generateAccessToken = (user: UserPayload): string => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
};

export const generateRefreshToken = (user: UserPayload): string => {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!);
    // Сохранение refreshToken в БД
    return refreshToken;
};

export const verifyRefreshToken = (token: string): UserPayload | null => {
    try {
        const userData = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as UserPayload;
        return userData;
    } catch (err) {
        return null;
    }
};
