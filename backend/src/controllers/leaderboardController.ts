import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const submitScore = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId, judgeId, participantId, score, feedback } = req.body;

    const newScore = await prisma.score.upsert({
      where: {
        eventId_judgeId_participantId: { eventId, judgeId, participantId }
      },
      update: { score: Number(score), feedback },
      create: { eventId, judgeId, participantId, score: Number(score), feedback }
    });

    res.status(200).json({ score: newScore });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    const scores = await prisma.score.findMany({
      where: { eventId }
    });

    // Aggregate scores by participant
    const aggregated: Record<string, { totalScore: number, judgeCount: number }> = {};

    scores.forEach(s => {
      const pId = s.participantId;
      if (!pId) return;
      if (!aggregated[pId]) {
        aggregated[pId] = { totalScore: 0, judgeCount: 0 };
      }
      aggregated[pId].totalScore += s.score;
      aggregated[pId].judgeCount += 1;
    });

    const leaderboard = Object.keys(aggregated).map(pId => ({
      participantId: pId,
      averageScore: aggregated[pId].totalScore / aggregated[pId].judgeCount
    })).sort((a, b) => b.averageScore - a.averageScore);

    res.status(200).json({ leaderboard });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
