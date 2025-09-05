import { Router } from 'express';
import homeRoutes from './home';
import shortUrlRoutes from './shortUrl';
import { URL } from '../enums/routes';

const mainRoutes: Router = Router();

mainRoutes.use(URL.HOME, homeRoutes);
mainRoutes.use(URL.SHORT_URL, shortUrlRoutes);

export default mainRoutes;
