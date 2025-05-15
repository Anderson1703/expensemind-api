import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { PlanesService } from "../../services/planes/planes.service";

export class PlanesController {
  private planesService: PlanesService;

  constructor() {
    this.planesService = new PlanesService();
  }

  async getPlanes(req: Request, res: Response, next: NextFunction) {
    try {
      const planes = await this.planesService.getPlanes();

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: planes,
      });
    } catch (error: any) {
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while fetching planes",
          },
        },
      });
    }
  }
  async createPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = req.body;

      const createdPlan = await this.planesService.createPlan(plan);

      res.status(StatusCodes.CREATED).json({
        status: StatusCodes.CREATED,
        body: createdPlan,
      });
    } catch (error: any) {
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while creating plan",
          },
        },
      });
    }
  }
  async updatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { id }: any = req.params;
      const plan = req.body;

      const updatedPlan = await this.planesService.updatePlan(id, plan);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: updatedPlan,
      });
    } catch (error: any) {
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while updating plan",
          },
        },
      });
    }
  }
  async deletePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { id }: any = req.params;

      const deletedPlan = await this.planesService.deletePlan(id);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: deletedPlan,
      });
    } catch (error: any) {
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while deleting plan",
          },
        },
      });
    }
  }
}
