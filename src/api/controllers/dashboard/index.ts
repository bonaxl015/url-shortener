import { Request, Response, NextFunction } from 'express';
import path from 'path';

import asyncHandler from '../../middlewares/asyncHandler';
import { StatusCode } from '../../enums/statusCodes';

/**
 * @method GET
 * @returns dashboard page html
 * @description request for getting html for dashboard page
 */
export const getDashboard = asyncHandler(
	async (_req: Request, res: Response, _next: NextFunction) => {
		return res.status(StatusCode.SUCCESS).render('dashboard');
	}
);

/**
 * @method GET
 * @returns dashboard page css
 * @description request for getting css for dashboard page
 */
export const getDashboardStyles = asyncHandler(
	async (_req: Request, res: Response, _next: NextFunction) => {
		return res
			.status(StatusCode.SUCCESS)
			.type('text/css')
			.sendFile(path.join(__dirname, '../../../view/dashboard/index.css'));
	}
);

/**
 * @method GET
 * @returns dashboard page js
 * @description request for getting js for dashboard page
 */
export const getDashboardJs = asyncHandler(
	async (_req: Request, res: Response, _next: NextFunction) => {
		return res
			.status(StatusCode.SUCCESS)
			.type('application/javascript')
			.sendFile(path.join(__dirname, '../../../view/dashboard/index.js'));
	}
);
