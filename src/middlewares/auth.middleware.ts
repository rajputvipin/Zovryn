import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt.utils';

// Augment Express Request
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
        return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
        return;
    }

    req.user = decoded;
    next();
};
