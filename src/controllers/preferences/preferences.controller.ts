import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { PreferencesService } from "../../services/preferences/preferences.service";

export class PreferencesController {
  private preferencesService: PreferencesService;

  constructor() {
    this.preferencesService = new PreferencesService();
  }

  async getPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).current_user.id;

      const preferences = await this.preferencesService.getPreferences(userId);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: preferences,
      });
    } catch (error: any) {
      console.log("Error in getPreferences: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while fetching preferences",
          },
        },
      });
    }
  }

  async createPreference(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).current_user.id;
      const preference = req.body;

      const createdPreference = await this.preferencesService.createPreference(
        preference,
        userId
      );

      res.status(StatusCodes.CREATED).json({
        status: StatusCodes.CREATED,
        body: createdPreference,
      });
    } catch (error: any) {
      console.log("Error in createPreference: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while creating preference",
          },
        },
      });
    }
  }

  async getPreferenceById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id }: any = req.params;

      const preference = await this.preferencesService.getPreferenceById(id);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: preference,
      });
    } catch (error: any) {
      console.log("Error in getPreferenceById: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while fetching preference",
          },
        },
      });
    }
  }
  async updatePreference(req: Request, res: Response, next: NextFunction) {
    try {
      const { id }: any = req.params;
      const preference = req.body;

      const updatedPreference = await this.preferencesService.updatePreference(
        id,
        preference
      );

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: updatedPreference,
      });
    } catch (error: any) {
      console.log("Error in updatePreference: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while updating preference",
          },
        },
      });
    }
  }
  async deletePreference(req: Request, res: Response, next: NextFunction) {
    try {
      const { id }: any = req.params;

      const preference = await this.preferencesService.deletePreference(id);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        body: preference,
      });
    } catch (error: any) {
      console.log("Error in deletePreference: ", error);
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          error: {
            message: error.message || "Server error while deleting preference",
          },
        },
      });
    }
  }
}
