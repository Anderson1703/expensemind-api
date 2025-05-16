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
const validation_session_middleware_1 = require("../../middlewares/validation-session.middleware");
const validation_schema_middleware_1 = require("../../middlewares/validation-schema.middleware");
const categories_schema_1 = require("../../schemas/categories.schema");
const categories_controller_1 = require("../../controllers/categories/categories.controller");
const categoriesRouter = (0, express_1.Router)();
const categoriesController = new categories_controller_1.CategoriesController();
categoriesRouter.get("/", validation_session_middleware_1.validateSession, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return categoriesController.getCategories(req, res, next); }));
categoriesRouter.get("/category/:id", validation_session_middleware_1.validateSession, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return categoriesController.getCategoryById(req, res, next); }));
categoriesRouter.post("/", validation_session_middleware_1.validateSession, (0, validation_schema_middleware_1.validateData)(categories_schema_1.CategoryCreateSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return categoriesController.createCategory(req, res, next); }));
categoriesRouter.patch("/category/:id", validation_session_middleware_1.validateSession, (0, validation_schema_middleware_1.validateData)(categories_schema_1.CategoryUpdateSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return categoriesController.updateCategory(req, res, next); }));
categoriesRouter.delete("/category/:id", validation_session_middleware_1.validateSession, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return categoriesController.deleteCategory(req, res, next); }));
exports.default = categoriesRouter;
