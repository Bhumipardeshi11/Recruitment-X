"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const startServer = async () => {
    await (0, db_1.connectDB)();
    const PORT = parseInt(env_1.env.PORT, 10) || 5000;
    app_1.default.listen(PORT, () => {
        console.log(`🚀 RecruitmentX Express API Server running on http://localhost:${PORT}`);
        console.log(`📡 Health Check available at http://localhost:${PORT}/health`);
        console.log(`⚡ API Router base path: http://localhost:${PORT}/api/v1`);
    });
};
startServer().catch((err) => {
    console.error('Failed to start RecruitmentX API Server:', err);
    process.exit(1);
});
