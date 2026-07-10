import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const createDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, collegeId } = req.body;

    if (!name || !collegeId) {
      res.status(400).json({ error: 'Name and collegeId are required' });
      return;
    }

    const existingDept = await prisma.department.findUnique({
      where: { name_collegeId: { name, collegeId } }
    });

    if (existingDept) {
      res.status(400).json({ error: 'Department already exists for this college' });
      return;
    }

    const department = await prisma.department.create({
      data: { name, collegeId },
    });

    res.status(201).json({ department });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getDepartments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { collegeId } = req.params;

    const departments = await prisma.department.findMany({
      where: { collegeId }
    });

    res.status(200).json({ departments });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.department.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
