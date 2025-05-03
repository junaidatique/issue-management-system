import { Context } from 'koa';
import jwt from 'jsonwebtoken';
import respond from './responses';
import User from '../models/user';

interface LoginRequest {
    email: string;
    password: string;
}

interface Auth {
    login: (context: Context) => Promise<void>;
}

const auth: Auth = {
    login: async (context: Context): Promise<void> => {
        const body = context.request.body as LoginRequest;
        const { email, password } = body;

        // Input validation
        if (!email || typeof email !== 'string' || email.trim().length === 0) {
            respond.badRequest(context, [{ message: 'Email is required and must be a non-empty string' }]);
            return;
        }

        if (!password || typeof password !== 'string' || password.trim().length === 0) {
            respond.badRequest(context, [{ message: 'Password is required and must be a non-empty string' }]);
            return;
        }

        try {
            // Find user by email
            const user = await User.findOne({ where: { email: email.trim() } });
            if (!user) {
                respond.unauthorized(context, { message: 'Invalid email or password' });
                return;
            }

            // Verify password
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                respond.unauthorized(context, { message: 'Invalid email or password' });
                return;
            }

            // Generate JWT token
            const token = jwt.sign(
                { email: user.email },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            respond.success(context, { token });
        } catch (error) {
            console.error('Error during login:', error);
            respond.internalServerError(context, { message: 'Failed to process login request' });
        }
    }
};

export default auth; 