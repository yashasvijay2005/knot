"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leaderboardController_1 = require("../controllers/leaderboardController");
const router = (0, express_1.Router)();
router.post('/score', leaderboardController_1.submitScore);
router.get('/:eventId', leaderboardController_1.getLeaderboard);
exports.default = router;
