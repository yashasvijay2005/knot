"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEventCategory = exports.getEventCategories = exports.createEventCategory = void 0;
const prisma_1 = require("../config/prisma");
const createEventCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        if (!name) {
            res.status(400).json({ error: 'Name is required' });
            return;
        }
        const existingCategory = yield prisma_1.prisma.eventCategory.findUnique({
            where: { name }
        });
        if (existingCategory) {
            res.status(400).json({ error: 'Event Category already exists' });
            return;
        }
        const category = yield prisma_1.prisma.eventCategory.create({
            data: { name, description },
        });
        res.status(201).json({ category });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.createEventCategory = createEventCategory;
const getEventCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield prisma_1.prisma.eventCategory.findMany();
        res.status(200).json({ categories });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getEventCategories = getEventCategories;
const deleteEventCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma_1.prisma.eventCategory.delete({
            where: { id }
        });
        res.status(200).json({ message: 'Event Category deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.deleteEventCategory = deleteEventCategory;
