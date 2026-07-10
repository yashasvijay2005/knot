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
exports.deleteVenue = exports.getVenues = exports.createVenue = void 0;
const prisma_1 = require("../config/prisma");
const createVenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, capacity, collegeId } = req.body;
        if (!name || !capacity || !collegeId) {
            res.status(400).json({ error: 'Name, capacity, and collegeId are required' });
            return;
        }
        const existingVenue = yield prisma_1.prisma.venue.findUnique({
            where: { name_collegeId: { name, collegeId } }
        });
        if (existingVenue) {
            res.status(400).json({ error: 'Venue already exists for this college' });
            return;
        }
        const venue = yield prisma_1.prisma.venue.create({
            data: { name, capacity: Number(capacity), collegeId },
        });
        res.status(201).json({ venue });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.createVenue = createVenue;
const getVenues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collegeId } = req.params;
        const venues = yield prisma_1.prisma.venue.findMany({
            where: { collegeId }
        });
        res.status(200).json({ venues });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getVenues = getVenues;
const deleteVenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma_1.prisma.venue.delete({
            where: { id }
        });
        res.status(200).json({ message: 'Venue deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.deleteVenue = deleteVenue;
