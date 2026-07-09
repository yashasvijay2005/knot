"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const collegeController_1 = require("../controllers/collegeController");
const router = (0, express_1.Router)();
router.post('/', collegeController_1.createCollege);
router.get('/', collegeController_1.getColleges);
exports.default = router;
