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
exports.PreferencesService = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
class PreferencesService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    getPreferences(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.preferences.findMany({
                where: { userId: userId },
                orderBy: {
                    createdAt: "desc",
                },
            });
        });
    }
    createPreference(preference, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.preferences.create({
                data: Object.assign(Object.assign({}, preference), { userId: userId }),
            });
        });
    }
    getPreferenceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const preference = yield this.prisma.preferences.findUnique({
                where: { id: id },
            });
            if (!preference) {
                throw {
                    message: "Preference not found",
                    status: http_status_codes_1.StatusCodes.NOT_FOUND,
                };
            }
            return preference;
        });
    }
    updatePreference(id, preference) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getPreferenceById(id);
            return yield this.prisma.preferences.update({
                where: { id: id },
                data: preference,
            });
        });
    }
    deletePreference(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getPreferenceById(id);
            return yield this.prisma.preferences.delete({
                where: { id: id },
            });
        });
    }
}
exports.PreferencesService = PreferencesService;
