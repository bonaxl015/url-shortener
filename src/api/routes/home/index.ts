import { Router } from 'express';
import { getHome, getHomeStyles } from '../../controllers/home'

const homeRoutes: Router = Router();

homeRoutes.get('', getHome);
homeRoutes.get('/css/home/index.css', getHomeStyles);

export default homeRoutes;
