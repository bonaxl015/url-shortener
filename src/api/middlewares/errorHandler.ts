import { NextFunction, Request, Response } from 'express';
import { ErrorHandlerFunction } from './types';
import { StatusCode } from '../enums/statusCodes';

const errorHandler: ErrorHandlerFunction = (
	error: Error,
	_request: Request,
	response: Response,
	_next: NextFunction
) => {
	const responseData = {
		error: error.message
	};

	response.status(StatusCode.BAD_REQUEST).json(responseData);
};

export default errorHandler;
