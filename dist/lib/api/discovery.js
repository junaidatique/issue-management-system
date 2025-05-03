"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responses_1 = __importDefault(require("./responses"));
const baseUrl = 'http://localhost:80801';
const discovery = (context) => {
    responses_1.default.success(context, {
        discovery: baseUrl
    });
};
exports.default = discovery;
//# sourceMappingURL=discovery.js.map