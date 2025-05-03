import { Context } from 'koa';

interface ErrorResponse {
    message: string;
    errors?: any[];
}

const responses = {
    success: (context: Context, data: any): void => {
        context.body = data;
        context.status = data ? 200 : 204;
    },
    badRequest: (context: Context, errors: any[]): void => {
        const response: ErrorResponse = {
            message: 'Check your request parameters',
            errors: errors
        };
        context.body = response;
        context.status = 400;
    },
    notFound: (context: Context): void => {
        const response: ErrorResponse = {
            message: 'Resource was not found'
        };
        context.body = response;
        context.status = 404;
    },
    created: (context: Context, data: any): void => {
        context.body = data;
        context.status = 201;
    },
    internalServerError: (context: Context, error: ErrorResponse): void => {
        context.body = error;
        context.status = 500;
    },
    unauthorized: (context: Context, error: ErrorResponse): void => {
        context.body = error;
        context.status = 401;
    }
};

export default responses; 