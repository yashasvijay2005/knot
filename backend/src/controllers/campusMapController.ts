import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getCampusMap = async (req: Request, res: Response): Promise<void> => {
  try {
    const { collegeId } = req.params;

    const venues = await prisma.venue.findMany({
      where: { collegeId },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        capacity: true
      }
    });

    res.status(200).json({ venues });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
