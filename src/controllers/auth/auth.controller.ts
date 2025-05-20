import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { AuthUtil } from "../../utils/auth/auth.util";
import { AuthService } from "../../services/auth/auth.service";

export class AuthController {
  private usersAuthService: AuthService;

  constructor() {
    this.usersAuthService = new AuthService();
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.usersAuthService.login(req.body);

      if (user.preferences?.twoFactor) {
        const otpCode = await AuthUtil.generateOTP();

        await this.usersAuthService.sendVerificationOTPCode({
          email: user.email,
          OTPCode: otpCode,
        });

        res.status(StatusCodes.OK).json({
          status: StatusCodes.OK,
          body: {
            message: "OTP code sent to your email",
          },
        });
      } else {
        const token = await AuthUtil.generateToken(user);

        res.status(StatusCodes.OK).json({
          status: StatusCodes.OK,
          body: {
            message: "Login successful",
            token: token,
            user: user,
          },
        });
      }
    } catch (error: any) {
      console.log("Error in login: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while logging in",
          },
        },
      });
    }
  }

  async sendOtpCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const otpCode = await AuthUtil.generateOTP();

      await this.usersAuthService.sendVerificationOTPCode({
        email: email,
        OTPCode: otpCode,
      });

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: {
          message: "OTP code sent to your email",
        },
      });
    } catch (error: any) {
      console.log("Error in sendOtpCode: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while sending OTP code",
          },
        },
      });
    }
  }

  async sendResetPasswordEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email } = req.body;

      const result = await this.usersAuthService.forgotPassword(email);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: {
          message: result.message,
        },
      });
    } catch (error: any) {
      console.log("Error in sendResetPasswordEmail: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while sending email",
          },
        },
      });
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await this.usersAuthService.resetPassword(req.body);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: {
          message: "Password reset successful",
        },
      });
    } catch (error: any) {
      console.log("Error in resetPassword: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while resetting password",
          },
        },
      });
    }
  }

  async verifyOTPCode(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.usersAuthService.verifyOTPCode(req.body);

      const token = await AuthUtil.generateToken(user);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: {
          message: "Login successfully",
          token: token,
          user: user,
        },
      });
    } catch (error: any) {
      console.log("Error in verifyOTPCode: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message:
              error.message || "Server error while verifying OTP code to login",
          },
        },
      });
    }
  }
}
