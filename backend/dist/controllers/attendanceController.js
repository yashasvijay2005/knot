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
exports.checkIn = void 0;
const prisma_1 = require("../config/prisma");
const checkIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { qrPayload, volunteerId } = req.body;
        let payload;
        try {
            payload = JSON.parse(qrPayload);
        }
        catch (e) {
            res.status(400).json({ error: 'Invalid QR code format' });
            return;
        }
        const { ticketId, eventId, userId } = payload;
        if (!ticketId || !eventId || !userId) {
            res.status(400).json({ error: 'Missing required ticket data in QR' });
            return;
        }
        // Verify registration and ticket
        const registration = yield prisma_1.prisma.registration.findUnique({
            where: { ticketId }
        });
        if (!registration) {
            res.status(404).json({ error: 'Registration not found for this ticket' });
            return;
        }
        if (registration.status !== 'CONFIRMED') {
            res.status(400).json({ error: 'Ticket is not valid (Waitlisted or Cancelled)' });
            return;
        }
        if (registration.eventId !== eventId || registration.userId !== userId) {
            res.status(400).json({ error: 'Ticket data mismatch' });
            return;
        }
        // Check for duplicate scan
        const existingAttendance = yield prisma_1.prisma.attendance.findUnique({
            where: { eventId_userId: { eventId, userId } }
        });
        if (existingAttendance) {
            res.status(409).json({ error: 'Duplicate scan: User has already checked in' });
            return;
        }
        // Log check-in
        const attendance = yield prisma_1.prisma.attendance.create({
            data: {
                eventId,
                userId,
                scannedBy: volunteerId
            }
        });
        res.status(200).json({ message: 'Check-in successful', attendance });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.checkIn = checkIn;
