import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const checkIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { qrPayload, volunteerId } = req.body;
    let payload;

    try {
      payload = JSON.parse(qrPayload);
    } catch (e) {
      res.status(400).json({ error: 'Invalid QR code format' });
      return;
    }

    const { ticketId, eventId, userId } = payload;

    if (!ticketId || !eventId || !userId) {
      res.status(400).json({ error: 'Missing required ticket data in QR' });
      return;
    }

    // Verify registration and ticket
    const registration = await prisma.registration.findUnique({
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
    const existingAttendance = await prisma.attendance.findUnique({
      where: { eventId_userId: { eventId, userId } }
    });

    if (existingAttendance) {
      res.status(409).json({ error: 'Duplicate scan: User has already checked in' });
      return;
    }

    // Log check-in
    const attendance = await prisma.attendance.create({
      data: {
        eventId,
        userId,
        scannedBy: volunteerId
      }
    });

    res.status(200).json({ message: 'Check-in successful', attendance });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
