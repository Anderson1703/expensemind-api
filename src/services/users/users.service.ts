import { Language, PrismaClient, Theme } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { UserCreateType, UserUpdateType } from "../../schemas/users.schema";
import { AuthUtil } from "../../utils/auth/auth.util";

export class UsersService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getUsers() {
    return await this.prisma.user.findMany({});
  }

  async loadData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        categories: true,
        expenses: true,
      },
    });
    if (!user) {
      throw {
        message: "User not found",
        status: StatusCodes.NOT_FOUND,
      };
    }
    return user;
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
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
        message: "User not found",
        status: StatusCodes.NOT_FOUND,
      };
    }

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw {
        message: "User not found",
        status: StatusCodes.NOT_FOUND,
      };
    }

    return user;
  }

  async getPaymentHistory(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        paymentHistory: true,
      },
    });

    if (!user) {
      throw {
        message: "User not found",
        status: StatusCodes.NOT_FOUND,
      };
    }

    return user.paymentHistory;
  }

  async updateUser(id: string, user: UserUpdateType) {
    await this.getUserById(id);

    await this.prisma.user.update({
      where: { id: id },
      data: user,
    });
  }

  async deleteUser(id: string) {
    await this.getUserById(id);

    await this.prisma.user.delete({
      where: { id: id },
    });
  }

  async changeUserPassword(
    id: string,
    currentPassword: string,
    newPasswor: string
  ) {
    const user = await this.getUserById(id);

    const isPasswordValid = await AuthUtil.comparePassword(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw {
        message: "Invalid password",
        status: StatusCodes.UNAUTHORIZED,
      };
    }

    if (currentPassword === newPasswor) {
      throw {
        message: "New password cannot be the same as the current password",
        status: StatusCodes.BAD_REQUEST,
      };
    }

    const passwordHashed = await AuthUtil.hashPassword(newPasswor);

    await this.prisma.user.update({
      where: { id: id },
      data: { password: passwordHashed },
    });
  }

  async createUser(data: UserCreateType) {
    const passwordHashed = await AuthUtil.hashPassword(data.password);

    const plan = await this.prisma.plan.findUnique({
      where: { id: data.planId },
    });
    if (!plan) {
      throw {
        message: "Plan not found",
        status: StatusCodes.NOT_FOUND,
      };
    }

    await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        last_name: data.last_name,
        password: passwordHashed,
        preferences: {
          create: {
            language: Language.EN,
            theme: Theme.LIGHT,
            twoFactor: true,
          },
        },
        subscriptions: {
          create: [
            {
              planId: plan.id,
              startDate: new Date(),
            },
          ],
        },
      },
    });
  }
}
