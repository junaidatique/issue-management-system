import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import respond from '../api/responses';
import config from '../../config';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface AuthMiddleware {
    validateToken: (ctx: Context, next: Next) => Promise<void>;
    validateClientId: (ctx: Context, next: Next) => Promise<void>;
}

const auth: AuthMiddleware = {
    validateToken: async (ctx: Context, next: Next): Promise<void> => {
        // Skip auth for discovery and health endpoints
        if (ctx.path === '/' || ctx.path === '/health') {
            await next();
            return;
        }

        const token = ctx.headers.authorization?.split(' ')[1];

        if (!token) {
            respond.unauthorized(ctx, { message: 'No token provided' });
            return;
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
            ctx.state.user = { email: decoded.email };
            await next();
        } catch (error) {
            respond.unauthorized(ctx, { message: 'Invalid token' });
        }
    },

    validateClientId: async (ctx: Context, next: Next): Promise<void> => {
        // Skip client ID validation for discovery and health endpoints
        if (ctx.path === '/' || ctx.path === '/health') {
            await next();
            return;
        }
        
        const clientId = ctx.headers['x-client-id'];
        console.log("🚀 ~ auth.ts:40 ~ validateClientId: ~ clientId:", clientId)
        console.log("🚀 ~ auth.ts:40 ~ validateClientId: ~ config.xClientId:", config)

        if (!clientId) {
            respond.badRequest(ctx, [{ message: 'X-Client-ID header is required' }]);
            return;
        }

        if (clientId !== config.xClientId) {
            respond.unauthorized(ctx, { message: 'Invalid client ID' });
            return;
        }
        ctx.state.clientId = clientId;
        await next();
    }
};

export default auth; 