import { Router } from 'express';
import { getHome, getHomeStyles, getHomeJs } from '../../controllers/home'

const homeRoutes: Router = Router();

homeRoutes.get('', getHome);
homeRoutes.get('/home/css/index.css', getHomeStyles);
homeRoutes.get('/home/js/index.js', getHomeJs);

export default homeRoutes;
