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
exports.getEvents = exports.createEvent = void 0;
const prisma_1 = require("../config/prisma");
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, startDate, endDate, registrationEnd, maxParticipants, teamSizeMin, teamSizeMax, rules, prizePool, visibility, categoryId, organizerId, collegeId } = req.body;
        if (!title || !startDate || !endDate || !categoryId || !organizerId || !collegeId) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const event = yield prisma_1.prisma.event.create({
            data: {
                title,
                description,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                registrationEnd: new Date(registrationEnd),
                maxParticipants: Number(maxParticipants),
                teamSizeMin: Number(teamSizeMin) || 1,
                teamSizeMax: Number(teamSizeMax) || 1,
                rules,
                prizePool,
                visibility: visibility || 'COLLEGE',
                status: 'PENDING',
                categoryId,
                organizerId,
                collegeId
            }
        });
        res.status(201).json({ event });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error', details: String(error) });
    }
});
exports.createEvent = createEvent;
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collegeId } = req.query;
        const filter = collegeId ? { collegeId: String(collegeId) } : {};
        const events = yield prisma_1.prisma.event.findMany({
            where: filter,
            include: {
                category: true,
                organizer: { select: { firstName: true, lastName: true } }
            }
        });
        res.status(200).json({ events });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getEvents = getEvents;
