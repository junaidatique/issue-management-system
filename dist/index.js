"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const config_1 = __importDefault(require("./config"));
const routes_1 = __importDefault(require("./lib/routes"));
const app = new koa_1.default();
app.use((0, koa_bodyparser_1.default)());
app.use(routes_1.default.routes());
app.use(routes_1.default.allowedMethods());
app.listen(config_1.default.port);
console.log(`Listening on http://localhost:${config_1.default.port}`);
//# sourceMappingURL=index.js.map