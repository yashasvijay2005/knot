import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { RegStatus, Event } from '@prisma/client';

const checkTimeClash = (existingEvents: Event[], newEvent: Event): boolean => {
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

export const registerIndividual = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId, userId } = req.body;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { registrations: true }
    });

    if (!event) { res.status(404).json({ error: 'Event not found' }); return; }

    const existingRegs = await prisma.registration.findMany({
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
    const status = isFull ? RegStatus.WAITLISTED : RegStatus.CONFIRMED;

    const registration = await prisma.registration.create({
      data: { eventId, userId, status }
    });

    res.status(201).json({ registration });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: String(error) });
  }
};

export const registerTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId, teamName, memberIds, leaderId } = req.body; // memberIds is an array of user IDs

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { registrations: true }
    });

    if (!event) { res.status(404).json({ error: 'Event not found' }); return; }

    if (memberIds.length < event.teamSizeMin || memberIds.length > event.teamSizeMax) {
      res.status(400).json({ error: `Team must have between ${event.teamSizeMin} and ${event.teamSizeMax} members` });
      return;
    }

    const team = await prisma.team.create({
      data: {
        name: teamName,
        eventId,
        members: {
          create: memberIds.map((id: string) => ({
            userId: id,
            isLeader: id === leaderId
          }))
        }
      }
    });

    const isFull = event.registrations.filter(r => r.status === 'CONFIRMED').length >= event.maxParticipants;
    const status = isFull ? RegStatus.WAITLISTED : RegStatus.CONFIRMED;

    const registration = await prisma.registration.create({
      data: { eventId, teamId: team.id, status }
    });

    res.status(201).json({ registration, team });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: String(error) });
  }
};

export const getUserRegistrations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Find individual registrations and team registrations
    const registrations = await prisma.registration.findMany({
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
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
