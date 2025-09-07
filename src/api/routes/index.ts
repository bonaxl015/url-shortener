import { Router } from 'express';
import homeRoutes from './home';
import shortUrlRoutes from './shortUrl';
import dashboardRoutes from './dashboard';
import redirectUrlRoutes from './redirect';
import { URL } from '../enums/routes';

const mainRoutes: Router = Router();

mainRoutes.use(URL.HOME, homeRoutes);
mainRoutes.use(URL.DASHBOARD, dashboardRoutes);
mainRoutes.use(URL.SHORT_URL, shortUrlRoutes);
mainRoutes.use(URL.EMPTY, redirectUrlRoutes);

export default mainRoutes;
