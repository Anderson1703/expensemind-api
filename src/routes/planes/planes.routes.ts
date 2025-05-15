import { Request, Response, NextFunction, Router } from "express";
import { validateData } from "../../middlewares/validation-schema.middleware";
import { PlanesController } from "../../controllers/planes/planes.controller";
import { PlanCreateSchema, PlanUpdateSchema } from "../../schemas/planes.schema";

const planesRouter = Router();
const planesController = new PlanesController();

planesRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) =>
    planesController.getPlanes(req, res, next)
);

planesRouter.post(
  "/",
  validateData(PlanCreateSchema),
  async (req: Request, res: Response, next: NextFunction) =>
    planesController.createPlan(req, res, next)
);

planesRouter.patch(
  "/:id",
  validateData(PlanUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) =>
    planesController.updatePlan(req, res, next)
);

planesRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) =>
    planesController.deletePlan(req, res, next)
);

export default planesRouter;