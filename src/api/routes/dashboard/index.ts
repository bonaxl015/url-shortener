import { Router } from 'express';
import {
  getDashboard,
  getDashboardStyles,
  getDashboardJs
} from '../../controllers/dashboard'
import { URL } from '../../enums/routes';

const dashboardRoutes: Router = Router();

dashboardRoutes.get(URL.EMPTY, getDashboard);
dashboardRoutes.get(URL.DASHBOARD_CSS, getDashboardStyles);
dashboardRoutes.get(URL.DASHBOARD_JS, getDashboardJs);

export default dashboardRoutes;
