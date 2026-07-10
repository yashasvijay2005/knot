"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registrationController_1 = require("../controllers/registrationController");
const router = (0, express_1.Router)();
router.post('/individual', registrationController_1.registerIndividual);
router.post('/team', registrationController_1.registerTeam);
router.get('/user/:userId', registrationController_1.getUserRegistrations);
exports.default = router;
