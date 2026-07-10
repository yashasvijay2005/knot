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
exports.getTicket = void 0;
const prisma_1 = require("../config/prisma");
const getTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { registrationId } = req.params;
        const registration = yield prisma_1.prisma.registration.findUnique({
            where: { id: registrationId },
            include: {
                event: { select: { title: true, startDate: true } },
                user: { select: { firstName: true, lastName: true, email: true } },
                team: { select: { name: true } }
            }
        });
        if (!registration) {
            res.status(404).json({ error: 'Registration not found' });
            return;
        }
        if (registration.status !== 'CONFIRMED') {
            res.status(400).json({ error: 'Ticket only available for confirmed registrations' });
            return;
        }
        // Payload embedded in the QR Code
        const qrPayload = JSON.stringify({
            ticketId: registration.ticketId,
            eventId: registration.eventId,
            userId: registration.userId,
            teamId: registration.teamId
        });
        res.status(200).json({ registration, qrPayload });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getTicket = getTicket;
