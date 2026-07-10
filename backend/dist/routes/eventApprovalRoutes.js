"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventApprovalController_1 = require("../controllers/eventApprovalController");
const router = (0, express_1.Router)();
router.patch('/:id/status', eventApprovalController_1.updateEventStatus);
router.patch('/:id/visibility', eventApprovalController_1.updateEventVisibility);
exports.default = router;
