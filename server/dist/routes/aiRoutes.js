"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiController_1 = require("../controllers/aiController");
const router = (0, express_1.Router)();
router.post('/cover-letter', aiController_1.AiController.generateCoverLetter);
router.post('/enhance-bullets', aiController_1.AiController.enhanceBullets);
router.post('/interview-prep', aiController_1.AiController.getInterviewPrep);
exports.default = router;
