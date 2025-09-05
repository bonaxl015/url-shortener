import { Router } from 'express';
import { getHome } from '../../controllers/home'

const homeRoutes: Router = Router();

homeRoutes.get('', getHome);

export default homeRoutes;
