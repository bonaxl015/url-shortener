import { Request, Response, NextFunction } from 'express';
import path from 'path';

import asyncHandler from '../../middlewares/asyncHandler';
import { StatusCode } from '../../enums/statusCodes';

const mockUrls = [
  {
    id: 1,
    shortUrl: 'abc123',
    originalUrl: 'https://www.google.com',
    dateCreated: new Date('2024-01-15'),
    dateUpdated: new Date('2024-01-15')
  },
  {
    id: 2,
    shortUrl: 'xyz789',
    originalUrl: 'https://www.github.com',
    dateCreated: new Date('2024-01-20'),
    dateUpdated: new Date('2024-01-22')
  },
  {
    id: 3,
    shortUrl: 'def456',
    originalUrl: 'https://www.stackoverflow.com',
    dateCreated: new Date('2024-01-25'),
    dateUpdated: new Date('2024-01-25')
  }
];

/**
 * @method GET
 * @returns dashboard page html
 * @description request for getting html for dashboard page
 */
export const getDashboard = asyncHandler(async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  return res.status(StatusCode.SUCCESS).render('dashboard', { urls: mockUrls });
});

/**
 * @method GET
 * @returns dashboard page css
 * @description request for getting css for dashboard page
 */
export const getDashboardStyles = asyncHandler(async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  return res
    .status(StatusCode.SUCCESS)
    .type('text/css')
    .sendFile(path.join(__dirname, '../../../view/dashboard/index.css'));
});

/**
 * @method GET
 * @returns dashboard page js
 * @description request for getting js for dashboard page
 */
export const getDashboardJs = asyncHandler(async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  return res
    .status(StatusCode.SUCCESS)
    .type('application/javascript')
    .sendFile(path.join(__dirname, '../../../view/dashboard/index.js'));
});
