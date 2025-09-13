import { Router } from 'express';
import {
	shortUrlGetAll,
	shortUrlCreate,
	shortUrlUpdate,
	shortUrlDelete,
	shortUrlTotalCount
} from '../../controllers/shortUrl';
import { URL } from '../../enums/routes';

const shortUrlRoutes: Router = Router();

shortUrlRoutes.get(URL.SHORT_URL_GET_ALL, shortUrlGetAll);
shortUrlRoutes.post(URL.SHORT_URL_CREATE, shortUrlCreate);
shortUrlRoutes.patch(URL.SHORT_URL_UPDATE, shortUrlUpdate);
shortUrlRoutes.delete(URL.SHORT_URL_DELETE, shortUrlDelete);
shortUrlRoutes.get(URL.SHORT_URL_TOTAL_COUNT, shortUrlTotalCount);

export default shortUrlRoutes;
