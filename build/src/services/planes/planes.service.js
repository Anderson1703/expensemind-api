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
exports.PlanesService = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
class PlanesService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    getPlanes() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.plan.findMany({
                orderBy: {
                    createdAt: "desc",
                },
            });
        });
    }
    createPlan(plan) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.plan.create({
                data: plan,
            });
        });
    }
    updatePlan(id, plan) {
        return __awaiter(this, void 0, void 0, function* () {
            const planExists = yield this.prisma.plan.findUnique({
                where: { id: id },
            });
            if (!planExists) {
                throw {
                    message: "Plan not found",
                    status: http_status_codes_1.StatusCodes.NOT_FOUND,
                };
            }
            return yield this.prisma.plan.update({
                where: { id: id },
                data: plan,
            });
        });
    }
    deletePlan(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const planExists = yield this.prisma.plan.findUnique({
                where: { id: id },
            });
            if (!planExists) {
                throw {
                    message: "Plan not found",
                    status: http_status_codes_1.StatusCodes.NOT_FOUND,
                };
            }
            return yield this.prisma.plan.delete({
                where: { id: id },
            });
        });
    }
}
exports.PlanesService = PlanesService;
