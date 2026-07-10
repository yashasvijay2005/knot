"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const departmentController_1 = require("../controllers/departmentController");
const router = (0, express_1.Router)();
router.post('/', departmentController_1.createDepartment);
router.get('/:collegeId', departmentController_1.getDepartments);
router.delete('/:id', departmentController_1.deleteDepartment);
exports.default = router;
