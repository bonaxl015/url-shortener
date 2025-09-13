import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import validUrl from 'valid-url';

import asyncHandler from '../../middlewares/asyncHandler';
import { StatusCode } from '../../enums/statusCodes';
import prismaClientInstance from '../../database/prisma';

dotenv.config();

const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

/**
 * @method GET
 * @param pageSize maximum amount of data returned per page
 * @param pageNumber current number of page to fetch
 * @returns list of original URL and its shortened URL
 * @description paging query of data based on pageNumber and pageSize values
 * @throws error when pageSize and pageNumber values are non-numerical
 */
export const shortUrlGetAll = asyncHandler(
	async (req: Request, res: Response, _next: NextFunction) => {
		const { pageSize, pageNumber } = req.query;
		const pageSizeToInt = Number(pageSize);
		const pageNumberToInt = Number(pageNumber);

		if (isNaN(pageSizeToInt) || isNaN(pageNumberToInt) || !pageNumberToInt) {
			throw new Error('Please enter a valid value');
		}

		try {
			const getAllUrl = await prismaClientInstance.shortUrl.findMany({
				skip: (pageNumberToInt - 1) * pageSizeToInt,
				take: pageSizeToInt,
				orderBy: {
					createdAt: 'desc'
				}
			});

			if (!getAllUrl) {
				throw new Error('Unable to fetch data');
			}

			res.status(StatusCode.SUCCESS).json(getAllUrl);
		} catch (error) {
			return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
				error: error instanceof Error ? error.message : 'Something went wrong'
			});
		}
	}
);

/**
 * @method POST
 * @param url valid URL to be shortened
 * @returns shortUrl, originalUrl
 * @description create new entry for shortened URL
 * @throws error when url is not provided
 */
export const shortUrlCreate = asyncHandler(
	async (req: Request, res: Response, _next: NextFunction) => {
		const { url } = req.body;

		if (!url) {
			throw new Error('URL is required');
		}

		if (!validUrl.isUri(url)) {
			throw new Error('Invalid URL');
		}

		try {
			const code = nanoid(8);

			const createdUrl = await prismaClientInstance.shortUrl.create({
				data: {
					code,
					originalUrl: url
				}
			});

			res.status(StatusCode.CREATED).json({
				shortUrl: `${BASE_URL}/${createdUrl.code}`,
				originalUrl: createdUrl.originalUrl
			});
		} catch (error) {
			return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
				error: error instanceof Error ? error.message : 'Something went wrong'
			});
		}
	}
);

/**
 * @method PATCH
 * @param id unique id of the entry to update
 * @param url valid URL to be shortened
 * @returns shortUrl, originalUrl
 * @description update existing entry for shortened URL
 * @throws error when id and url is not provided
 */
export const shortUrlUpdate = asyncHandler(
	async (req: Request, res: Response, _next: NextFunction) => {
		const { id, url } = req.body;

		if (!id) {
			throw new Error('ID is required');
		}

		if (!url) {
			throw new Error('URL is required');
		}

		if (!validUrl.isUri(url)) {
			throw new Error('Invalid URL');
		}

		const findUrl = await prismaClientInstance.shortUrl.findUnique({
			where: { id }
		});

		if (!findUrl) {
			throw new Error('Data not found');
		}

		try {
			const updatedUrl = await prismaClientInstance.shortUrl.update({
				where: { id },
				data: {
					originalUrl: url
				}
			});

			res.status(StatusCode.SUCCESS).json({
				shortUrl: `${BASE_URL}/${updatedUrl.code}`,
				originalUrl: updatedUrl.originalUrl
			});
		} catch (error) {
			return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
				error: error instanceof Error ? error.message : 'Something went wrong'
			});
		}
	}
);

/**
 * @method DELETE
 * @param id unique id of the entry to delete
 * @returns deleteSuccess = true if deletion is successful
 * @description delete existing entry for shortened URL
 * @throws error when id is empty
 */
export const shortUrlDelete = asyncHandler(
	async (req: Request, res: Response, _next: NextFunction) => {
		const { id } = req.body;

		if (!id) {
			throw new Error('ID is required');
		}

		const findUrl = await prismaClientInstance.shortUrl.findUnique({
			where: { id }
		});

		if (!findUrl) {
			throw new Error('Data not found');
		}

		try {
			const deleteUrl = await prismaClientInstance.shortUrl.delete({
				where: { id }
			});

			if (!deleteUrl) {
				throw new Error('Data delete failed');
			}

			res.status(StatusCode.SUCCESS).json({ deleteSuccess: true });
		} catch (error) {
			return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
				error: error instanceof Error ? error.message : 'Something went wrong'
			});
		}
	}
);

/**
 * @method GET
 * @returns total number of URL shoretened list
 * @description get the total number of records for shortened URLs
 */
export const shortUrlTotalCount = asyncHandler(
	async (_req: Request, res: Response, _next: NextFunction) => {
		try {
			const totalCount = await prismaClientInstance.shortUrl.count();

			if (!totalCount && totalCount !== 0) {
				throw new Error('Unable to get total count');
			}

			res.status(StatusCode.SUCCESS).json({ total: totalCount });
		} catch (error) {
			return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
				error: error instanceof Error ? error.message : 'Something went wrong'
			});
		}
	}
);
