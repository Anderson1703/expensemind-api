import { Router, Request, Response, NextFunction } from "express";
import { validateSession } from "../../middlewares/validation-session.middleware";
import { validateData } from "../../middlewares/validation-schema.middleware";
import { PreferencesController } from "../../controllers/preferences/preferences.controller";
import {
  PreferenceCreateSchema,
  PreferenceUpdateSchema,
} from "../../schemas/preferences.schema";

const preferencesRouter = Router();
const preferencesController = new PreferencesController();

preferencesRouter.get(
  "/",
  validateSession,
  async (req: Request, res: Response, next: NextFunction) =>
    preferencesController.getPreferences(req, res, next)
);
preferencesRouter.post(
  "/",
  validateSession,
  validateData(PreferenceCreateSchema),
  async (req: Request, res: Response, next: NextFunction) =>
    preferencesController.createPreference(req, res, next)
);
preferencesRouter.get(
  "/preference/:id",
  validateSession,
  async (req: Request, res: Response, next: NextFunction) =>
    preferencesController.getPreferenceById(req, res, next)
);
preferencesRouter.patch(
  "/preference/:id",
  validateSession,
  validateData(PreferenceUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) =>
    preferencesController.updatePreference(req, res, next)
);
preferencesRouter.delete(
  "/preference/:id",
  validateSession,
  async (req: Request, res: Response, next: NextFunction) =>
    preferencesController.deletePreference(req, res, next)
);
export default preferencesRouter;
