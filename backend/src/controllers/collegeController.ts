import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const createCollege = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, domain } = req.body;

    const existingCollege = await prisma.college.findFirst({
      where: { OR: [{ name }, { domain }] }
    });

    if (existingCollege) {
      res.status(400).json({ error: 'College or domain already exists' });
      return;
    }

    const college = await prisma.college.create({
      data: { name, domain, isVerified: false },
    });

    res.status(201).json({ college });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getColleges = async (req: Request, res: Response): Promise<void> => {
  try {
    const colleges = await prisma.college.findMany();
    res.status(200).json({ colleges });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
