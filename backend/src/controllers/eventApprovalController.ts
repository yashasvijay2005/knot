import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { EventStatus, Visibility } from '@prisma/client';

export const updateEventStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(EventStatus).includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const event = await prisma.event.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({ event });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateEventVisibility = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { visibility } = req.body;

    if (!Object.values(Visibility).includes(visibility)) {
      res.status(400).json({ error: 'Invalid visibility' });
      return;
    }

    const event = await prisma.event.update({
      where: { id },
      data: { visibility }
    });

    res.status(200).json({ event });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
