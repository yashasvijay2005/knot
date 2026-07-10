import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import crypto from 'crypto';

export const issueCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, eventId, type } = req.body;

    if (!['PARTICIPATION', 'WINNER', 'VOLUNTEER', 'JUDGE'].includes(type)) {
      res.status(400).json({ error: 'Invalid certificate type' });
      return;
    }

    const uniqueString = `${userId}-${eventId}-${type}-${Date.now()}`;
    const hash = crypto.createHash('sha256').update(uniqueString).digest('hex');

    const certificate = await prisma.certificate.create({
      data: {
        userId,
        eventId,
        type,
        hash
      }
    });

    res.status(201).json({ certificate });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: String(error) });
  }
};

export const verifyCertificate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hash } = req.params;

    const certificate = await prisma.certificate.findUnique({
      where: { hash },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        event: { select: { title: true } }
      }
    });

    if (!certificate) {
      res.status(404).json({ error: 'Certificate not found or invalid' });
      return;
    }

    res.status(200).json({ certificate, valid: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: String(error) });
  }
};

export const getUserCertificates = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const certificates = await prisma.certificate.findMany({
      where: { userId },
      include: { event: { select: { title: true, startDate: true } } },
      orderBy: { issueDate: 'desc' }
    });

    res.status(200).json({ certificates });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: String(error) });
  }
};
