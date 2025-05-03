"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responses_1 = __importDefault(require("./responses"));
const issue_1 = __importDefault(require("../models/issue"));
const issues = {
    get: async (context) => {
        const issue = await issue_1.default.findByPk(context.params.id);
        responses_1.default.success(context, { issue });
    }
};
exports.default = issues;
//# sourceMappingURL=issues.js.map