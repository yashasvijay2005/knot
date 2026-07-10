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
exports.getUserRegistrations = exports.registerTeam = exports.registerIndividual = void 0;
const prisma_1 = require("../config/prisma");
const client_1 = require("@prisma/client");
const checkTimeClash = (existingEvents, newEvent) => {
    const newStart = new Date(newEvent.startDate).getTime();
    const newEnd = new Date(newEvent.endDate).getTime();
    for (const existing of existingEvents) {
        const existingStart = new Date(existing.startDate).getTime();
        const existingEnd = new Date(existing.endDate).getTime();
        // Condition for overlap: Start1 < End2 AND Start2 < End1
        if (newStart < existingEnd && existingStart < newEnd) {
            return true;
        }
    }
    return false;
};
const registerIndividual = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId, userId } = req.body;
        const event = yield prisma_1.prisma.event.findUnique({
            where: { id: eventId },
            include: { registrations: true }
        });
        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        const existingRegs = yield prisma_1.prisma.registration.findMany({
            where: { userId },
            include: { event: true }
        });
        // Check if already registered
        if (existingRegs.some(r => r.eventId === eventId)) {
            res.status(400).json({ error: 'Already registered' });
            return;
        }
        // Smart Clash Detection
        const userEvents = existingRegs.map(r => r.event);
        if (checkTimeClash(userEvents, event)) {
            res.status(409).json({ error: 'Time clash detected with an existing registration.' });
            return;
        }
        const isFull = event.registrations.filter(r => r.status === 'CONFIRMED').length >= event.maxParticipants;
        const status = isFull ? client_1.RegStatus.WAITLISTED : client_1.RegStatus.CONFIRMED;
        const registration = yield prisma_1.prisma.registration.create({
            data: { eventId, userId, status }
        });
        res.status(201).json({ registration });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error', details: String(error) });
    }
});
exports.registerIndividual = registerIndividual;
const registerTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId, teamName, memberIds, leaderId } = req.body; // memberIds is an array of user IDs
        const event = yield prisma_1.prisma.event.findUnique({
            where: { id: eventId },
            include: { registrations: true }
        });
        if (!event) {
            res.status(404).json({ error: 'Event not found' });
            return;
        }
        if (memberIds.length < event.teamSizeMin || memberIds.length > event.teamSizeMax) {
            res.status(400).json({ error: `Team must have between ${event.teamSizeMin} and ${event.teamSizeMax} members` });
            return;
        }
        const team = yield prisma_1.prisma.team.create({
            data: {
                name: teamName,
                eventId,
                members: {
                    create: memberIds.map((id) => ({
                        userId: id,
                        isLeader: id === leaderId
                    }))
                }
            }
        });
        const isFull = event.registrations.filter(r => r.status === 'CONFIRMED').length >= event.maxParticipants;
        const status = isFull ? client_1.RegStatus.WAITLISTED : client_1.RegStatus.CONFIRMED;
        const registration = yield prisma_1.prisma.registration.create({
            data: { eventId, teamId: team.id, status }
        });
        res.status(201).json({ registration, team });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error', details: String(error) });
    }
});
exports.registerTeam = registerTeam;
const getUserRegistrations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Find individual registrations and team registrations
        const registrations = yield prisma_1.prisma.registration.findMany({
            where: {
                OR: [
                    { userId },
                    { team: { members: { some: { userId } } } }
                ]
            },
            include: {
                event: true,
                team: { include: { members: { include: { user: { select: { firstName: true, lastName: true } } } } } }
            }
        });
        res.status(200).json({ registrations });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getUserRegistrations = getUserRegistrations;
