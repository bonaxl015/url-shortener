import { Router } from 'express';
import { redirectUrl } from '../../controllers/redirect'
import { URL } from '../../enums/routes';

const redirectUrlRoutes: Router = Router();

redirectUrlRoutes.get(URL.REDIRECT_CODE, redirectUrl);

export default redirectUrlRoutes;
