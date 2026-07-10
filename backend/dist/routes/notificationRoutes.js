"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = require("../controllers/notificationController");
const router = (0, express_1.Router)();
router.get('/user/:userId', notificationController_1.getUserNotifications);
router.patch('/:id/read', notificationController_1.markAsRead);
router.post('/', notificationController_1.createNotification);
exports.default = router;
