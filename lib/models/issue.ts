import { Model, DataTypes } from 'sequelize';
import sequelize from './connection';

interface IssueAttributes {
    id?: number;
    title: string;
    description: string;
    created_by?: string;
    updated_by?: string;
    created_at?: Date;
    updated_at?: Date;
}

class Issue extends Model<IssueAttributes> implements IssueAttributes {
    public id!: number;
    public title!: string;
    public description!: string;
    public created_by!: string;
    public updated_by!: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Issue.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    created_by: {
        type: DataTypes.STRING,
        defaultValue: 'system'
    },
    updated_by: {
        type: DataTypes.STRING,
        defaultValue: 'system'
    }
}, {
    sequelize,
    modelName: 'issue',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    tableName: 'issues'
});

export default Issue; 