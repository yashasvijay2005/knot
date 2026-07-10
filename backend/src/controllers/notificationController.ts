import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getUserNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    res.status(200).json({ notification });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, title, message } = req.body;

    const notification = await prisma.notification.create({
      data: { userId, title, message }
    });

    res.status(201).json({ notification });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
