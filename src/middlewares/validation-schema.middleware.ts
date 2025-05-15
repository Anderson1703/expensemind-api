import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';

export const validateData = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {

      schema.parse(req.body);

      const parsed = schema.safeParse(req.body);

      if (!parsed.success) {
        throw {
          status: StatusCodes.BAD_REQUEST,
          message: "Invalid body"
        }
      }

      if (Object.keys(parsed.data).length === 0) {
        throw {
          status: StatusCodes.BAD_REQUEST,
          message: 'Body is required'
        }
      }

      next();
    } catch (error: any) {
      if (error instanceof ZodError) {

        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }))
        res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: 'Invalid data',
          details: errorMessages
        });

      } else {
        res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
          status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
          message: error.message || 'Server error'
        });
      }
    }
  };
}