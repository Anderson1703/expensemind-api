"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_schema_middleware_1 = require("../../middlewares/validation-schema.middleware");
const planes_controller_1 = require("../../controllers/planes/planes.controller");
const planes_schema_1 = require("../../schemas/planes.schema");
const planesRouter = (0, express_1.Router)();
const planesController = new planes_controller_1.PlanesController();
planesRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return planesController.getPlanes(req, res, next); }));
planesRouter.post("/", (0, validation_schema_middleware_1.validateData)(planes_schema_1.PlanCreateSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return planesController.createPlan(req, res, next); }));
planesRouter.patch("/:id", (0, validation_schema_middleware_1.validateData)(planes_schema_1.PlanUpdateSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return planesController.updatePlan(req, res, next); }));
planesRouter.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return planesController.deletePlan(req, res, next); }));
exports.default = planesRouter;
