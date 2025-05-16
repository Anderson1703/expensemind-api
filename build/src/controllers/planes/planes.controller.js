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
exports.PlanesController = void 0;
const http_status_codes_1 = require("http-status-codes");
const planes_service_1 = require("../../services/planes/planes.service");
class PlanesController {
    constructor() {
        this.planesService = new planes_service_1.PlanesService();
    }
    getPlanes(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const planes = yield this.planesService.getPlanes();
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: planes,
                });
            }
            catch (error) {
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while fetching planes",
                        },
                    },
                });
            }
        });
    }
    createPlan(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const plan = req.body;
                const createdPlan = yield this.planesService.createPlan(plan);
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    status: http_status_codes_1.StatusCodes.CREATED,
                    body: createdPlan,
                });
            }
            catch (error) {
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while creating plan",
                        },
                    },
                });
            }
        });
    }
    updatePlan(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const plan = req.body;
                const updatedPlan = yield this.planesService.updatePlan(id, plan);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: updatedPlan,
                });
            }
            catch (error) {
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while updating plan",
                        },
                    },
                });
            }
        });
    }
    deletePlan(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deletedPlan = yield this.planesService.deletePlan(id);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: deletedPlan,
                });
            }
            catch (error) {
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while deleting plan",
                        },
                    },
                });
            }
        });
    }
}
exports.PlanesController = PlanesController;
