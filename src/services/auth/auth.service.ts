import { PrismaClient, User } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { MailUtil } from "../../utils/mail/mail.util";
import { AuthUtil } from "../../utils/auth/auth.util";

export class AuthService {
  private prisma: PrismaClient;
  private mailUtil: MailUtil;

  constructor() {
    this.prisma = new PrismaClient();
    this.mailUtil = new MailUtil();
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
      include: {
        preferences: true,
        subscriptions: {
          include: {
            plan: true,
          },
        },
        categories: true,
      },
    });

    if (!user) {
      throw {
        message: "Invalid credentials",
        status: StatusCodes.NOT_FOUND,
      };
    }

    const isValidPassword = await AuthUtil.comparePassword(
      password,
      user.password
    );

    if (!isValidPassword) {
      throw {
        message: "Invalid credentials",
        status: StatusCodes.UNAUTHORIZED,
      };
    }

    return user;
  }

  async forgotPassword(email: string) {
    return await this.prisma.$transaction(async (tsx) => {
      const user = await tsx.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        throw {
          message: "User not found",
          status: StatusCodes.NOT_FOUND,
        };
      }

      const token = await AuthUtil.generateRandomString(32);

      await tsx.recovery.create({
        data: {
          email: user.email,
          token,
          expiration: new Date(Date.now() + 5 * 60 * 1000),
        },
      });

      const result = await this.mailUtil.sendResetPasswordMail({
        to: user.email,
        token: token,
      });

      if (result.error) {
        throw {
          message: result.message,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
        };
      }

      return result;
    });
  }

  async resetPassword({
    password,
    token,
  }: {
    password: string;
    token: string;
  }) {
    return await this.prisma.$transaction(async (tsx) => {
      const recovery = await tsx.recovery.findUnique({
        where: { token: token },
      });

      if (!recovery) {
        throw {
          message: "Invalid token",
          status: StatusCodes.UNAUTHORIZED,
        };
      }

      if (new Date() > recovery.expiration) {
        throw {
          message: "Token expired",
          status: StatusCodes.UNAUTHORIZED,
        };
      }

      const user = await tsx.user.findUnique({
        where: { email: recovery.email },
      });

      if (!user) {
        throw {
          message: "User not found",
          status: StatusCodes.NOT_FOUND,
        };
      }

      const hashedPassword = await AuthUtil.hashPassword(password);

      await tsx.user.update({
        where: { email: recovery.email },
        data: { password: hashedPassword },
      });

      await tsx.recovery.delete({
        where: { token: token },
      });

      return user;
    });
  }

  async sendVerificationOTPCode({
    OTPCode,
    email,
  }: {
    OTPCode: string;
    email: string;
  }) {
    return await this.prisma.$transaction(async (tsx) => {
      const user = await tsx.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        throw {
          message: "User not found",
          status: StatusCodes.NOT_FOUND,
        };
      }

      await tsx.otps.create({
        data: {
          email: user.email,
          otp: OTPCode,
          expiration: new Date(Date.now() + 5 * 60 * 1000),
        },
      });

      const result = await this.mailUtil.sendOTPCode({
        to: email,
        otp: OTPCode,
      });

      if (result.error) {
        throw {
          message: result.message,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
        };
      }

      return result;
    });
  }

  async verifyOTPCode({ OTPCode, email }: { OTPCode: string; email: string }) {
    return await this.prisma.$transaction(async (tsx) => {
      
      const otpRecord = await tsx.otps.findUnique({
        where: {
          otp: OTPCode,
          email: email,
        },
      });

      if (!otpRecord ) {
        throw {
          message: "Already used OTP code or invalid OTP code",
          status: StatusCodes.UNAUTHORIZED,
        };
      }

      if (new Date() > otpRecord.expiration) {
        throw {
          message: "OTP code expired",
          status: StatusCodes.UNAUTHORIZED,
        };
      }

      const user = await tsx.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        throw {
          message: "User not found",
          status: StatusCodes.NOT_FOUND,
        };
      }

      await tsx.user.update({
        where: {
          email: email,
        },
        data: {
          updatedAt: new Date(),
        },
      });

      await tsx.otps.delete({
        where: {
          otp: OTPCode,
        },
      });

      const userResponse = await this.prisma.user.findUnique({
        where: { email: email },
        include: {
          preferences: true,
          subscriptions: {
            include: {
              plan: true,
            },
          },
        },
      });

      if (!userResponse) {
        throw {
          message: "User not found",
          status: StatusCodes.NOT_FOUND,
        };
      }

      return userResponse;
    });
  }
}
