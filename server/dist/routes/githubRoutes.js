"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const githubController_1 = require("../controllers/githubController");
const router = (0, express_1.Router)();
router.get('/audit/:username', githubController_1.GitHubController.auditProfile);
router.post('/audit', githubController_1.GitHubController.auditProfile);
exports.default = router;
