"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("./connection"));
class Issue extends sequelize_1.Model {
}
Issue.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    title: sequelize_1.DataTypes.STRING,
    description: sequelize_1.DataTypes.STRING,
    created_by: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'unknown'
    },
    updated_by: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'unknown'
    }
}, {
    sequelize: connection_1.default,
    modelName: 'issue',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    tableName: 'issues'
});
exports.default = Issue;
//# sourceMappingURL=issue.js.map