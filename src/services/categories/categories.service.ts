import { PrismaClient } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import {
  CategoryCreateType,
  CategoryUpdateType,
} from "../../schemas/categories.schema";

export class CategoriesService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getCategories(userId: string) {
    return await this.prisma.category.findMany({
      where: { userId: userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getCategoryById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: id },
    });

    if (!category) {
      throw {
        message: "Category not found",
        status: StatusCodes.NOT_FOUND,
      };
    }

    return category;
  }

  async createCategory(category: CategoryCreateType, userId: string) {

    const categoryExists = await this.prisma.category.findUnique({
      where: {
        userId_name: {
          userId: userId,
          name: category.name,
        }
      },
    });

    if (categoryExists) {
      throw {
        message: "Category already exists",
        status: StatusCodes.BAD_REQUEST,
      };
    }

    return await this.prisma.category.create({
      data: {
        ...category,
        userId: userId,
      },
    });
  }

  async updateCategory(id: string, category: CategoryUpdateType) {
    await this.getCategoryById(id);

    return await this.prisma.category.update({
      where: { id: id },
      data: category,
    });
  }

  async deleteCategory(id: string) {
    await this.getCategoryById(id);
  
    return await this.prisma.$transaction(async (tsx) => {
      await tsx.expense.deleteMany({
        where: {
          categoryId: id,
        },
      });
  
      const category = await tsx.category.delete({
        where: { id: id },
      });
  
      return category;
    });
  }
  
}
