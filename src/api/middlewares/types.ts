import { Request, Response, NextFunction } from "express";

export type AsyncHandlerFunction = (
  request: Request,
  response: Response,
  next: NextFunction,
) => Promise<void | Response>;
