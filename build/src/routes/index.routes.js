"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const users_routes_1 = __importDefault(require("./users/users.routes"));
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const categories_routes_1 = __importDefault(require("./categories/categories.routes"));
const planes_routes_1 = __importDefault(require("./planes/planes.routes"));
const preferences_route_1 = __importDefault(require("./preferences/preferences.route"));
const expenses_routes_1 = __importDefault(require("./expenses/expenses.routes"));
const ocr_routes_1 = __importDefault(require("./ocr/ocr.routes"));
const root = (0, express_1.Router)();
const server = (0, express_1.default)();
root.get("/", (req, res) => {
    res.send("ExpenseMind API");
});
server.use("/", root);
server.use("/users", users_routes_1.default);
server.use("/auth", auth_routes_1.default);
server.use("/categories", categories_routes_1.default);
server.use("/planes", planes_routes_1.default);
server.use("/preferences", preferences_route_1.default);
server.use("/expenses", expenses_routes_1.default);
server.use("/ocr", ocr_routes_1.default);
exports.default = server;
