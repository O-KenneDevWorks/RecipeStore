// Import Router from Express to create modular route handlers
import { Router } from 'express';

// Import API routes from the api directory
import apiRoutes from './api/index.js';

// Create an instance of the Express Router
const router = Router();

// Mount all API routes under the `/api` path
// This ensures that any routes defined in `apiRoutes` will be accessible via `/api/*`
router.use('/api', apiRoutes);

// Export the configured router for use in the main server file
export default router;