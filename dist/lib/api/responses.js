"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responses = {
    success: (context, data) => {
        context.body = data;
        context.status = data ? 200 : 204;
    },
    badRequest: (context, errors) => {
        const response = {
            message: 'Check your request parameters',
            errors: errors
        };
        context.body = response;
        context.status = 400;
    },
    notFound: (context) => {
        const response = {
            message: 'Resource was not found'
        };
        context.body = response;
        context.status = 404;
    }
};
exports.default = responses;
//# sourceMappingURL=responses.js.map