import { Request, Response, NextFunction } from 'express';
import path from 'path';

import asyncHandler from '../../middlewares/asyncHandler';
import { StatusCode } from '../../enums/statusCodes';

export const getHome = asyncHandler(async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  return res.status(StatusCode.SUCCESS).render('home');
});

export const getHomeStyles = asyncHandler(async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  return res
    .status(StatusCode.SUCCESS)
    .type('text/css')
    .sendFile(path.join(__dirname, '../../../view/home/index.css'));
});

export const getHomeJs = asyncHandler(async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  return res
    .status(StatusCode.SUCCESS)
    .type('application/javascript')
    .sendFile(path.join(__dirname, '../../../view/home/index.js'));
});
