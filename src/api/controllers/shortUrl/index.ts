import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import { StatusCode } from '../../enums/statusCodes';
import { mockURLRedirects } from './mockData';

export const shortUrl = asyncHandler(async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const shortUrlId = req.baseUrl.replace('/', '');

  const redirectURL = mockURLRedirects[shortUrlId]

  res.status(StatusCode.MOVED_PERMANENTLY).redirect(redirectURL);
});
