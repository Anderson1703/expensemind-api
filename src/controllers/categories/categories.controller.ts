import { StatusCodes } from "http-status-codes";
import { CategoriesService } from "../../services/categories/categories.service";
import { Request, Response, NextFunction } from "express";

export class CategoriesController {
  private categoriesService: CategoriesService;

  constructor() {
    this.categoriesService = new CategoriesService();
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).current_user.id;
    
        const categories = await this.categoriesService.getCategories(userId);
    
        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            body: categories,
        });
    } catch (error: any) {
      console.log("Error in getCategories: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while fetching categories",
          },
        },
      });
    }
  }

  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id }: any = req.params;
    
        const category = await this.categoriesService.getCategoryById(id);
    
        res.status(StatusCodes.OK).json({
          status: StatusCodes.OK,
          body: category,
        });
    } catch (error: any) {
        console.log("Error in getCategoryById: ", error);
        res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
          status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
          body: {
            error: {
              message: error.message || "Server error while fetching category",
            },
          },
        });
      }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).current_user.id;
        const category = req.body;
    
        const createdCategory = await this.categoriesService.createCategory(
          category,
          userId
        );
    
        res.status(StatusCodes.CREATED).json({
          status: StatusCodes.CREATED,
          body: createdCategory,
        });
      } catch (error: any) {
        console.log("Error in createCategory: ", error);
        res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
          status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
          body: {
            error: {
              message: error.message || "Server error while creating category",
            },
          },
        });
      }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const { id }: any = req.params;
    
        const updatedCategory = await this.categoriesService.updateCategory(id, req.body);
    
        res.status(StatusCodes.OK).json({
          status: StatusCodes.OK,
          body: updatedCategory,
        });
      } catch (error: any) {
        console.log("Error in updateCategory: ", error);
        res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
          status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
          body: {
            error: {
              message: error.message || "Server error while updating category",
            },
          },
        });
      }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const { id }: any = req.params;
    
        const category = await this.categoriesService.deleteCategory(id);
    
        res.status(StatusCodes.OK).json({
          status: StatusCodes.OK,
          body: category,
        });
      } catch (error: any) {
        console.log("Error in deleteCategory: ", error);
        res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
          status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
          body: {
            error: {
              message: error.message || "Server error while deleting category",
            },
          },
        });
      }
  }
}
