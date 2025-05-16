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
exports.PreferencesController = void 0;
const http_status_codes_1 = require("http-status-codes");
const preferences_service_1 = require("../../services/preferences/preferences.service");
class PreferencesController {
    constructor() {
        this.preferencesService = new preferences_service_1.PreferencesService();
    }
    getPreferences(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.current_user.id;
                const preferences = yield this.preferencesService.getPreferences(userId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: preferences,
                });
            }
            catch (error) {
                console.log("Error in getPreferences: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while fetching preferences",
                        },
                    },
                });
            }
        });
    }
    createPreference(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.current_user.id;
                const preference = req.body;
                const createdPreference = yield this.preferencesService.createPreference(preference, userId);
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    status: http_status_codes_1.StatusCodes.CREATED,
                    body: createdPreference,
                });
            }
            catch (error) {
                console.log("Error in createPreference: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while creating preference",
                        },
                    },
                });
            }
        });
    }
    getPreferenceById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const preference = yield this.preferencesService.getPreferenceById(id);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: preference,
                });
            }
            catch (error) {
                console.log("Error in getPreferenceById: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while fetching preference",
                        },
                    },
                });
            }
        });
    }
    updatePreference(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const preference = req.body;
                const updatedPreference = yield this.preferencesService.updatePreference(id, preference);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: updatedPreference,
                });
            }
            catch (error) {
                console.log("Error in updatePreference: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while updating preference",
                        },
                    },
                });
            }
        });
    }
    deletePreference(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const preference = yield this.preferencesService.deletePreference(id);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    body: preference,
                });
            }
            catch (error) {
                console.log("Error in deletePreference: ", error);
                res.status(error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: error.status || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    body: {
                        error: {
                            message: error.message || "Server error while deleting preference",
                        },
                    },
                });
            }
        });
    }
}
exports.PreferencesController = PreferencesController;
