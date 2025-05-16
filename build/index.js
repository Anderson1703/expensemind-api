"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const server_1 = __importDefault(require("./src/server"));
const PORT = process.env.PORT || 8080;
server_1.default.listen(PORT, () => {
    console.log(`[server on]: running in http://localhost:${PORT}/api`);
});
server_1.default.on('error', (error) => {
    console.log('[error on]: ', error);
});
