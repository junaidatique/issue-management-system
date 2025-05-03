"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const discovery_1 = __importDefault(require("./api/discovery"));
const health_1 = __importDefault(require("./api/health"));
const issues_1 = __importDefault(require("./api/issues"));
const router = new koa_router_1.default();
router.get('/', discovery_1.default);
router.get('/health', health_1.default);
router.get('/issues/:id', issues_1.default.get);
exports.default = router;
//# sourceMappingURL=routes.js.map