"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const certificateController_1 = require("../controllers/certificateController");
const router = (0, express_1.Router)();
router.post('/', certificateController_1.issueCertificate);
router.get('/verify/:hash', certificateController_1.verifyCertificate);
router.get('/user/:userId', certificateController_1.getUserCertificates);
exports.default = router;
