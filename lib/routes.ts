import Router from 'koa-router';
import discovery from './api/discovery';
import health from './api/health';
import issues from './api/issues';
import auth from './api/auth';
import authMiddleware from './middleware/auth';

const router = new Router();

// Public routes
router.get('/', discovery);
router.get('/health', health);
router.post('/login', auth.login);

// Protected routes
router.get('/issues', authMiddleware.validateToken, authMiddleware.validateClientId, issues.list);
router.get('/issues/:id', authMiddleware.validateToken, authMiddleware.validateClientId, issues.get);
router.post('/issues', authMiddleware.validateToken, authMiddleware.validateClientId, issues.create);
router.patch('/issues/:id', authMiddleware.validateToken, authMiddleware.validateClientId, issues.update);
router.get('/issues/:id/revisions', authMiddleware.validateToken, authMiddleware.validateClientId, issues.getRevisions);
router.get('/issues/:id/compare', authMiddleware.validateToken, authMiddleware.validateClientId, issues.compareRevisions);

export default router; 