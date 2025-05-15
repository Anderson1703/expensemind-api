import { StatusCodes } from "http-status-codes";
import e, { Request, Response, NextFunction } from "express";
import { UsersService } from "../../services/users/users.service";

export class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  private async validateId(id: string) {
    if (!id) {
      throw {
        message: "User id is required",
        status: StatusCodes.BAD_REQUEST,
      };
    }

    if (typeof id !== "string" || id.length < 5) {
      throw {
        message: "Invalid user id",
        status: StatusCodes.BAD_REQUEST,
      };
    }
  }

  private async validateEmail(email: any) {
    if (!email) {
      throw {
        message: "User email is required",
        status: StatusCodes.BAD_REQUEST,
      };
    }

    if (
      typeof email !== "string" ||
      !email.includes("@") ||
      !email.includes(".") ||
      email.length < 5
    ) {
      throw {
        message: "Invalid user email",
        status: StatusCodes.BAD_REQUEST,
      };
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.usersService.getUsers();

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: users,
      });
    } catch (error: any) {
      console.log("Error in getUsers: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while fetching users",
          },
        },
      });
    }
  }

  async loadData(req: Request, res: Response, next: NextFunction) {
    try {
      const current_user: any = (req as any).current_user;

      const users = await this.usersService.loadData(current_user.id);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: {
          expenses: users.expenses,
          categories: users.categories,
        },
      });
    } catch (error: any) {
      console.log("Error in loadData: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while loading data",
          },
        },
      });
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id }: any = req.params;

      await this.validateId(id);

      const user = await this.usersService.getUserById(id);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: user,
      });
    } catch (error: any) {
      console.log("Error in getUserById: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while fetching user",
          },
        },
      });
    }
  }

  async getUserByToken(req: Request, res: Response, next: NextFunction) {
    debugger;
    try {
      const current_user: any = (req as any).current_user;

      await this.validateId(current_user.id);

      const user = await this.usersService.getUserById(current_user.id);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: user,
      });
    } catch (error: any) {
      console.log("Error in getUserByToken: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while fetching user",
          },
        },
      });
    }
  }

  async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email }: any = req.params;

      await this.validateEmail(email);

      const user = await this.usersService.getUserByEmail(email);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: user,
      });
    } catch (error: any) {
      console.log("Error in getUserByEmail: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while fetching user",
          },
        },
      });
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id }: any = req.params;

      await this.validateId(id);

      await this.usersService.updateUser(id, req.body);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: {
          message: "User updated successfully",
        },
      });
    } catch (error: any) {
      console.log("Error in updateUser: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while updating user",
          },
        },
      });
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id }: any = req.params;

      await this.validateId(id);

      await this.usersService.deleteUser(id);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: {
          message: "User deleted successfully",
        },
      });
    } catch (error: any) {
      console.log("Error in deleteUser: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while deleting user",
          },
        },
      });
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      await this.usersService.createUser(req.body);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: {
          message: "User created successfully",
        },
      });
    } catch (error: any) {
      console.log("Error in createUser: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error",
          },
        },
      });
    }
  }

  async changeUserPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).current_user.id;

      const { currentPassword, newPassword }: any = req.body;

      await this.usersService.changeUserPassword(
        userId,
        currentPassword,
        newPassword
      );

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: {
          message: "User password changed successfully",
        },
      });
    } catch (error: any) {
      console.log("Error in changeUserPassword: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message:
              error.message || "Server error while changing user password",
          },
        },
      });
    }
  }
}
