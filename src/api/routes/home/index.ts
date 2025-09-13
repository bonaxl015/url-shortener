import { Router } from 'express';
import { getHome, getHomeStyles, getHomeJs } from '../../controllers/home';
import { URL } from '../../enums/routes';

const homeRoutes: Router = Router();

homeRoutes.get(URL.EMPTY, getHome);
homeRoutes.get(URL.HOME_CSS, getHomeStyles);
homeRoutes.get(URL.HOME_JS, getHomeJs);

export default homeRoutes;
