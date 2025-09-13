import { Request, Response, NextFunction } from 'express';
import path from 'path';

import asyncHandler from '../../middlewares/asyncHandler';
import { StatusCode } from '../../enums/statusCodes';

/**
 * @method GET
 * @returns not found html page
 * @description renders not found page when it doesn't match any route
 */
export const notFoundHtml = asyncHandler(
	async (_req: Request, res: Response, _next: NextFunction) => {
		return res.status(StatusCode.SUCCESS).render('not-found');
	}
);

/**
 * @method GET
 * @returns not found page css
 * @description requests not found css when it doesn't match any route
 */
export const notFoundCss = asyncHandler(
	async (_req: Request, res: Response, _next: NextFunction) => {
		return res
			.status(StatusCode.SUCCESS)
			.type('text/css')
			.sendFile(path.join(__dirname, '../../../view/not-found/index.css'));
	}
);

/**
 * @method GET
 * @returns not found page js
 * @description requests not found script file when it doesn't match any route
 */
export const notFoundJs = asyncHandler(
	async (_req: Request, res: Response, _next: NextFunction) => {
		return res
			.status(StatusCode.SUCCESS)
			.type('application/javascript')
			.sendFile(path.join(__dirname, '../../../view/not-found/index.js'));
	}
);
