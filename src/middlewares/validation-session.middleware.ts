import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthUtil } from "../utils/auth/auth.util";
// validateSession middleware
export const validateSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw {
        message: "Token not sent",
      };
    }

    const decoded = await AuthUtil.verifyToken(token as string);

    if (!decoded.isValid) {
      throw {
        message: "Token is invalid",
      };
    }

    (req as any).current_user = decoded.data;

    next();
  } catch (error: any) {
    console.error("Error en validateSession:", error);
    res.status(StatusCodes.UNAUTHORIZED).json({
      status: StatusCodes.UNAUTHORIZED,
      body: {
        error: {
          message: error.message || "Invalid session",
        },
      },
    });
  }
};
