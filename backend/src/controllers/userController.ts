import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { collegeId } = req.params;

    const users = await prisma.user.findMany({
      where: { collegeId },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true }
    });

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, firstName: true, lastName: true, role: true }
    });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
