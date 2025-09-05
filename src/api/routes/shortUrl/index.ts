import { Router } from 'express';
import { shortUrl } from '../../controllers/shortUrl'

const shortUrlRoutes: Router = Router();

shortUrlRoutes.get('', shortUrl);

export default shortUrlRoutes;
