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
exports.CategoriesController = void 0;
const http_status_codes_1 = require("http-status-codes");
const categories_service_1 = require("../../services/categories/categories.service");
class CategoriesController {
    constructor() {
        this.categoriesService = new categories_service_1.CategoriesService();
    }
    getCategories(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.current_user.id;
                const categories = yield this.categoriesService.getCategories(userId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: categories,
                });
            }
            catch (error) {
                console.log("Error in getCategories: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while fetching categories",
                        },
                    },
                });
            }
        });
    }
    getCategoryById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const category = yield this.categoriesService.getCategoryById(id);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: category,
                });
            }
            catch (error) {
                console.log("Error in getCategoryById: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while fetching category",
                        },
                    },
                });
            }
        });
    }
    createCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.current_user.id;
                const category = req.body;
                const createdCategory = yield this.categoriesService.createCategory(category, userId);
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    status: http_status_codes_1.StatusCodes.CREATED,
                    body: createdCategory,
                });
            }
            catch (error) {
                console.log("Error in createCategory: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while creating category",
                        },
                    },
                });
            }
        });
    }
    updateCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updatedCategory = yield this.categoriesService.updateCategory(id, req.body);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: updatedCategory,
                });
            }
            catch (error) {
                console.log("Error in updateCategory: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while updating category",
                        },
                    },
                });
            }
        });
    }
    deleteCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const category = yield this.categoriesService.deleteCategory(id);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: category,
                });
            }
            catch (error) {
                console.log("Error in deleteCategory: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while deleting category",
                        },
                    },
                });
            }
        });
    }
}
exports.CategoriesController = CategoriesController;
