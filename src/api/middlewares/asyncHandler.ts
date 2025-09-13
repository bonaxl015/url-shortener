import { Request, Response, NextFunction } from 'express';
import { AsyncHandlerFunction } from './types';

const asyncHandler =
	(fn: AsyncHandlerFunction) =>
	(request: Request, response: Response, next: NextFunction): Promise<void | Response> =>
		Promise.resolve(fn(request, response, next)).catch(next);

export default asyncHandler;
