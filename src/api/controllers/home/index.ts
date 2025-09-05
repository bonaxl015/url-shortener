import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import { StatusCode } from '../../enums/statusCodes';

export const getHome = asyncHandler(async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(StatusCode.SUCCESS).send('Test');
});
