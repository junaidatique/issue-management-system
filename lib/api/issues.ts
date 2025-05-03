import { Context } from 'koa';
import respond from './responses';
import Issue from '../models/issue';
import IssueRevision from '../models/issue-revision';

interface CreateIssueRequest {
    title: string;
    description: string;
}

interface UpdateIssueRequest {
    title?: string;
    description?: string;
}

interface ListIssuesQuery {
    page?: string;
    limit?: string;
}

interface CompareRevisionsQuery {
    from?: string;
    to?: string;
}

interface Issues {
    get: (context: Context) => Promise<void>;
    create: (context: Context) => Promise<void>;
    list: (context: Context) => Promise<void>;
    update: (context: Context) => Promise<void>;
    getRevisions: (context: Context) => Promise<void>;
    compareRevisions: (context: Context) => Promise<void>;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const issues: Issues = {
    get: async (context: Context): Promise<void> => {
        const issue = await Issue.findByPk(context.params.id);
        respond.success(context, { issue });
    },

    create: async (context: Context): Promise<void> => {
        const body = context.request.body as CreateIssueRequest;
        const { title, description } = body;

        // Input validation
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            respond.badRequest(context, [{ message: 'Title is required and must be a non-empty string' }]);
            return;
        }

        if (!description || typeof description !== 'string' || description.trim().length === 0) {
            respond.badRequest(context, [{ message: 'Description is required and must be a non-empty string' }]);
            return;
        }

        try {
            const userEmail = context.state.user?.email || 'system';
            
            // Create the issue
            const issue = await Issue.create({
                title: title.trim(),
                description: description.trim(),
                created_by: userEmail,
                updated_by: userEmail
            });

            // Create initial revision
            await IssueRevision.create({
                issue_id: issue.id,
                title: issue.title,
                description: issue.description,
                changes: {
                    title: issue.title,
                    description: issue.description
                },
                created_by: userEmail
            });

            respond.created(context, { issue });
        } catch (error) {
            console.error('Error creating issue:', error);
            respond.internalServerError(context, { message: 'Failed to create issue' });
        }
    },

    list: async (context: Context): Promise<void> => {
        try {
            const query = context.query as ListIssuesQuery;
            
            // Parse and validate pagination parameters
            const page = Math.max(1, parseInt(query.page || String(DEFAULT_PAGE), 10));
            const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(query.limit || String(DEFAULT_LIMIT), 10)));
            
            // Calculate offset
            const offset = (page - 1) * limit;

            // Get total count and paginated issues
            const { count, rows: issues } = await Issue.findAndCountAll({
                limit,
                offset,
                order: [['created_at', 'DESC']] // Sort by most recent first
            });

            // Calculate pagination metadata
            const totalPages = Math.ceil(count / limit);
            const hasNextPage = page < totalPages;
            const hasPreviousPage = page > 1;

            respond.success(context, {
                issues,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: count,
                    itemsPerPage: limit,
                    hasNextPage,
                    hasPreviousPage
                }
            });
        } catch (error) {
            console.error('Error listing issues:', error);
            respond.internalServerError(context, { message: 'Failed to fetch issues' });
        }
    },

    update: async (context: Context): Promise<void> => {
        const issueId = context.params.id;
        const body = context.request.body as UpdateIssueRequest;
        const { title, description } = body;

        try {
            // Find the issue
            const issue = await Issue.findByPk(issueId);
            if (!issue) {
                respond.notFound(context);
                return;
            }

            // Validate at least one field is being updated
            if (!title && !description) {
                respond.badRequest(context, [{ message: 'At least one field (title or description) must be provided for update' }]);
                return;
            }

            // Validate title if provided
            if (title !== undefined) {
                if (typeof title !== 'string' || title.trim().length === 0) {
                    respond.badRequest(context, [{ message: 'Title must be a non-empty string' }]);
                    return;
                }
            }

            // Validate description if provided
            if (description !== undefined) {
                if (typeof description !== 'string' || description.trim().length === 0) {
                    respond.badRequest(context, [{ message: 'Description must be a non-empty string' }]);
                    return;
                }
            }

            const userEmail = context.state.user?.email || 'system';

            // Prepare update data
            const updateData: Partial<Issue> = {};
            if (title !== undefined) updateData.title = title.trim();
            if (description !== undefined) updateData.description = description.trim();
            updateData.updated_by = userEmail;

            // Track changes for revision
            const changes: Record<string, any> = {};
            if (title !== undefined) changes.title = title.trim();
            if (description !== undefined) changes.description = description.trim();

            // Update the issue
            await issue.update(updateData);

            // Create revision
            await IssueRevision.create({
                issue_id: issue.id,
                title: issue.title,
                description: issue.description,
                changes,
                created_by: userEmail
            });

            // Fetch the updated issue to return
            const updatedIssue = await Issue.findByPk(issueId);
            respond.success(context, { issue: updatedIssue });
        } catch (error) {
            console.error('Error updating issue:', error);
            respond.internalServerError(context, { message: 'Failed to update issue' });
        }
    },

    getRevisions: async (context: Context): Promise<void> => {
        const issueId = context.params.id;

        try {
            // Find the issue
            const issue = await Issue.findByPk(issueId);
            if (!issue) {
                respond.notFound(context);
                return;
            }

            // Get all revisions for the issue
            const revisions = await IssueRevision.findAll({
                where: { issue_id: issueId },
                order: [['created_at', 'DESC']]
            });

            respond.success(context, { revisions });
        } catch (error) {
            console.error('Error fetching revisions:', error);
            respond.internalServerError(context, { message: 'Failed to fetch revisions' });
        }
    },

    compareRevisions: async (context: Context): Promise<void> => {
        const issueId = context.params.id;
        const query = context.query as CompareRevisionsQuery;
        const fromRevision = query.from ? parseInt(query.from, 10) : undefined;
        const toRevision = query.to ? parseInt(query.to, 10) : undefined;

        try {
            // Find the issue
            const issue = await Issue.findByPk(issueId);
            if (!issue) {
                respond.notFound(context);
                return;
            }

            // Get all revisions for the issue
            const revisions = await IssueRevision.findAll({
                where: { issue_id: issueId },
                order: [['created_at', 'ASC']]
            });

            if (revisions.length === 0) {
                respond.notFound(context);
                return;
            }

            // Validate revision numbers
            const maxRevision = revisions.length;
            if (fromRevision && (fromRevision < 1 || fromRevision > maxRevision)) {
                respond.badRequest(context, [{ message: `Invalid 'from' revision number. Must be between 1 and ${maxRevision}` }]);
                return;
            }
            if (toRevision && (toRevision < 1 || toRevision > maxRevision)) {
                respond.badRequest(context, [{ message: `Invalid 'to' revision number. Must be between 1 and ${maxRevision}` }]);
                return;
            }

            // Default to first and last revision if not specified
            const fromIndex = fromRevision ? fromRevision - 1 : 0;
            const toIndex = toRevision ? toRevision - 1 : revisions.length - 1;

            // Ensure fromIndex is less than toIndex
            if (fromIndex > toIndex) {
                respond.badRequest(context, [{ message: "'from' revision must be less than or equal to 'to' revision" }]);
                return;
            }

            const fromRev = revisions[fromIndex];
            const toRev = revisions[toIndex];

            // Calculate changes
            const changes: Record<string, { from: any; to: any }> = {};
            if (fromRev.title !== toRev.title) {
                changes.title = { from: fromRev.title, to: toRev.title };
            }
            if (fromRev.description !== toRev.description) {
                changes.description = { from: fromRev.description, to: toRev.description };
            }

            // Get the revisions between from and to
            const revisionsBetween = revisions.slice(fromIndex, toIndex + 1);

            respond.success(context, {
                before: {
                    title: fromRev.title,
                    description: fromRev.description,
                    created_at: fromRev.created_at
                },
                after: {
                    title: toRev.title,
                    description: toRev.description,
                    created_at: toRev.created_at
                },
                changes,
                revisions: revisionsBetween.map(rev => ({
                    title: rev.title,
                    description: rev.description,
                    changes: rev.changes,
                    created_at: rev.created_at,
                    created_by: rev.created_by
                }))
            });
        } catch (error) {
            console.error('Error comparing revisions:', error);
            respond.internalServerError(context, { message: 'Failed to compare revisions' });
        }
    }
};

export default issues; 