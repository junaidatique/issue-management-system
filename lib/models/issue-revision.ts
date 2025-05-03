import { Model, DataTypes } from 'sequelize';
import sequelize from './connection';
import Issue from './issue';

interface IssueRevisionAttributes {
    id?: number;
    issue_id: number;
    title: string;
    description: string;
    changes: Record<string, any>;
    created_by: string;
    created_at?: Date;
}

class IssueRevision extends Model<IssueRevisionAttributes> implements IssueRevisionAttributes {
    public id!: number;
    public issue_id!: number;
    public title!: string;
    public description!: string;
    public changes!: Record<string, any>;
    public created_by!: string;
    public readonly created_at!: Date;
}

IssueRevision.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },
    issue_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Issue,
            key: 'id'
        }
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    changes: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    created_by: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'issue_revision',
    timestamps: true,
    updatedAt: false,
    createdAt: 'created_at',
    tableName: 'issue_revisions'
});

// Set up the association
Issue.hasMany(IssueRevision, { foreignKey: 'issue_id' });
IssueRevision.belongsTo(Issue, { foreignKey: 'issue_id' });

export default IssueRevision; 