import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const createEventCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const existingCategory = await prisma.eventCategory.findUnique({
      where: { name }
    });

    if (existingCategory) {
      res.status(400).json({ error: 'Event Category already exists' });
      return;
    }

    const category = await prisma.eventCategory.create({
      data: { name, description },
    });

    res.status(201).json({ category });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getEventCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.eventCategory.findMany();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteEventCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.eventCategory.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Event Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
