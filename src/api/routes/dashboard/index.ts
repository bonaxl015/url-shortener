import { Router } from 'express';
import {
  getDashboard,
  getDashboardStyles,
  getDashboardJs
} from '../../controllers/dashboard'

const dashboardRoutes: Router = Router();

dashboardRoutes.get('', getDashboard);
dashboardRoutes.get('/css/index.css', getDashboardStyles);
dashboardRoutes.get('/js/index.js', getDashboardJs);

export default dashboardRoutes;
