import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const getDashboardAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { collegeId } = req.params;

    const [
      totalUsers,
      totalEvents,
      totalRegistrations,
      totalCheckIns,
      eventCategories
    ] = await Promise.all([
      prisma.user.count({ where: { collegeId } }),
      prisma.event.count({ where: { collegeId } }),
      prisma.registration.count({ where: { event: { collegeId } } }),
      prisma.attendance.count({ where: { event: { collegeId } } }),
      prisma.eventCategory.findMany({
        include: {
          events: {
            where: { collegeId },
            select: { id: true }
          }
        }
      })
    ]);

    // Format category data properly since _count relations with where clauses can be tricky across Prisma versions
    const categoryData = eventCategories.map(cat => ({
      name: cat.name,
      events: cat.events.length
    }));

    res.status(200).json({
      summary: {
        totalUsers,
        totalEvents,
        totalRegistrations,
        totalCheckIns
      },
      categoryData
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
