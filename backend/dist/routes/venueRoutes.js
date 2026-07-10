"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const venueController_1 = require("../controllers/venueController");
const router = (0, express_1.Router)();
router.post('/', venueController_1.createVenue);
router.get('/:collegeId', venueController_1.getVenues);
router.delete('/:id', venueController_1.deleteVenue);
exports.default = router;
