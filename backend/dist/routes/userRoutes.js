"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.get('/:collegeId', userController_1.getUsers);
router.patch('/:id/role', userController_1.updateUserRole);
router.delete('/:id', userController_1.deleteUser);
exports.default = router;
