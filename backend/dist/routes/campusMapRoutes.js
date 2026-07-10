"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const campusMapController_1 = require("../controllers/campusMapController");
const router = (0, express_1.Router)();
router.get('/:collegeId', campusMapController_1.getCampusMap);
exports.default = router;
