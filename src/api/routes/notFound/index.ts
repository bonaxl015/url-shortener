import { Router } from 'express';
import { notFoundHtml, notFoundCss, notFoundJs } from '../../controllers/notFound'
import { URL } from '../../enums/routes';

const notFoundUrlRoutes: Router = Router();

notFoundUrlRoutes.get(URL.NOT_FOUND_CSS, notFoundCss);
notFoundUrlRoutes.get(URL.NOT_FOUND_JS, notFoundJs);
notFoundUrlRoutes.get(URL.NOT_FOUND, notFoundHtml);

export default notFoundUrlRoutes;
