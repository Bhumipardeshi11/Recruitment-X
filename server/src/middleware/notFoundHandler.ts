import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from './errorHandler';

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new NotFoundError('Route'));
};