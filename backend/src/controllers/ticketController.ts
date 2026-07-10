import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrationId } = req.params;

    const registration = await prisma.registration.findUnique({
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
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
