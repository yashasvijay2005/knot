import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const createVenue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, capacity, collegeId } = req.body;

    if (!name || !capacity || !collegeId) {
      res.status(400).json({ error: 'Name, capacity, and collegeId are required' });
      return;
    }

    const existingVenue = await prisma.venue.findUnique({
      where: { name_collegeId: { name, collegeId } }
    });

    if (existingVenue) {
      res.status(400).json({ error: 'Venue already exists for this college' });
      return;
    }

    const venue = await prisma.venue.create({
      data: { name, capacity: Number(capacity), collegeId },
    });

    res.status(201).json({ venue });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getVenues = async (req: Request, res: Response): Promise<void> => {
  try {
    const { collegeId } = req.params;

    const venues = await prisma.venue.findMany({
      where: { collegeId }
    });

    res.status(200).json({ venues });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteVenue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.venue.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Venue deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
