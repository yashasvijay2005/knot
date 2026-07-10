import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title, description, startDate, endDate, registrationEnd,
      maxParticipants, teamSizeMin, teamSizeMax, rules, prizePool,
      visibility, categoryId, organizerId, collegeId
    } = req.body;

    if (!title || !startDate || !endDate || !categoryId || !organizerId || !collegeId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const event = await prisma.event.create({
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
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: String(error) });
  }
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { collegeId } = req.query;
    const filter = collegeId ? { collegeId: String(collegeId) } : {};

    const events = await prisma.event.findMany({
      where: filter,
      include: {
        category: true,
        organizer: { select: { firstName: true, lastName: true } }
      }
    });

    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
