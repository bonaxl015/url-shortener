import { Request, Response, NextFunction } from 'express';
import path from 'path';

import asyncHandler from '../../middlewares/asyncHandler';
import { StatusCode } from '../../enums/statusCodes';

/**
 * @method GET
 * @returns home page html
 * @description request for getting html for home page
 */
export const getHome = asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
	return res.status(StatusCode.SUCCESS).render('home');
});

/**
 * @method GET
 * @returns home page css
 * @description request for getting css for home page
 */
export const getHomeStyles = asyncHandler(
	async (_req: Request, res: Response, _next: NextFunction) => {
		return res
			.status(StatusCode.SUCCESS)
			.type('text/css')
			.sendFile(path.join(__dirname, '../../../view/home/index.css'));
	}
);

/**
 * @method GET
 * @returns home page js
 * @description request for getting js for home page
 */
export const getHomeJs = asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
	return res
		.status(StatusCode.SUCCESS)
		.type('application/javascript')
		.sendFile(path.join(__dirname, '../../../view/home/index.js'));
});
