"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventCategoryController_1 = require("../controllers/eventCategoryController");
const router = (0, express_1.Router)();
router.post('/', eventCategoryController_1.createEventCategory);
router.get('/', eventCategoryController_1.getEventCategories);
router.delete('/:id', eventCategoryController_1.deleteEventCategory);
exports.default = router;
