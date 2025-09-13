import { Request, Response, NextFunction } from 'express';

import asyncHandler from '../../middlewares/asyncHandler';
import { StatusCode } from '../../enums/statusCodes';
import prismaClientInstance from '../../database/prisma';

/**
 * @method GET
 * @param code shortened URL code
 * @returns void
 * @description accepts code and redirect to it specified original URL
 */
export const redirectUrl = asyncHandler(
	async (req: Request, res: Response, _next: NextFunction) => {
		const { code } = req.params;

		try {
			const searchResult = await prismaClientInstance.shortUrl.findUnique({
				where: { code }
			});

			if (!searchResult) {
				return res.status(StatusCode.SUCCESS).render('not-found');
			}

			await prismaClientInstance.shortUrl.update({
				where: { id: searchResult.id },
				data: { clicks: { increment: 1 } }
			});

			return res.status(StatusCode.MOVED_PERMANENTLY).redirect(searchResult.originalUrl);
		} catch (error) {
			return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
				error: error instanceof Error ? error.message : 'Something went wrong'
			});
		}
	}
);
