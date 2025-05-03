"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responses_1 = __importDefault(require("./responses"));
const health = (context) => {
    responses_1.default.success(context, {
        message: 'OK'
    });
};
exports.default = health;
//# sourceMappingURL=health.js.map