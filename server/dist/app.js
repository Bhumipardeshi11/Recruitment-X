"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Static uploads folder for resume files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'online',
        service: 'RecruitmentX AI ATS API Engine',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});
// REST API V1 Routes
app.use('/api/v1', routes_1.default);
// Global Error Handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
