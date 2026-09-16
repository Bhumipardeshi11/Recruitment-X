"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const atsController_1 = require("../controllers/atsController");
const router = (0, express_1.Router)();
router.post('/score', atsController_1.AtsController.analyze);
exports.default = router;
