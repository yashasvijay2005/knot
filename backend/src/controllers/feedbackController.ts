import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

// Simulated AI Sentiment Analysis
const analyzeSentiment = (comment: string): string => {
  const lower = comment.toLowerCase();
  if (lower.includes('great') || lower.includes('awesome') || lower.includes('good') || lower.includes('loved')) {
    return 'POSITIVE';
  }
  if (lower.includes('bad') || lower.includes('terrible') || lower.includes('worst') || lower.includes('boring')) {
    return 'NEGATIVE';
  }
  return 'NEUTRAL';
};

export const submitFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId, userId, rating, comment } = req.body;

    const sentiment = analyzeSentiment(comment);

    const feedback = await prisma.feedback.upsert({
      where: {
        eventId_userId: { eventId, userId }
      },
      update: { rating: Number(rating), comment, sentiment },
      create: { eventId, userId, rating: Number(rating), comment, sentiment }
    });

    res.status(200).json({ feedback });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getEventFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    const feedbacks = await prisma.feedback.findMany({
      where: { eventId },
      include: { user: { select: { firstName: true, lastName: true } } }
    });

    res.status(200).json({ feedbacks });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Simulated AI Event Summary
export const getEventSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    const feedbacks = await prisma.feedback.findMany({ where: { eventId } });
    const attendance = await prisma.attendance.count({ where: { eventId } });

    if (feedbacks.length === 0) {
      res.status(200).json({ summary: "Not enough data to generate an AI summary." });
      return;
    }

    const posCount = feedbacks.filter(f => f.sentiment === 'POSITIVE').length;
    const avgRating = feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length;

    const summary = `AI Summary: The event had ${attendance} attendees check in. It received an average rating of ${avgRating.toFixed(1)}/5. Overall sentiment was ${posCount > (feedbacks.length / 2) ? 'highly positive' : 'mixed'}.`;

    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
