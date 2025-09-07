import { Request, Response, NextFunction } from "express";

export type AsyncHandlerFunction = (
  request: Request,
  response: Response,
  next: NextFunction,
) => Promise<void | Response>;

export type ErrorHandlerFunction = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) => void;
