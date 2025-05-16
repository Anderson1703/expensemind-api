"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_routes_1 = __importDefault(require("../routes/index.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const server = (0, express_1.default)();
server.use(express_1.default.urlencoded({ extended: true }));
server.use(express_1.default.json());
server.use((0, cookie_parser_1.default)());
server.use('/api', index_routes_1.default);
server.get('/', (req, res) => {
    res.redirect('/api');
});
exports.default = server;
