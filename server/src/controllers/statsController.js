import { prisma } from '../index.js';

// Get general statistics
export const getStats = async (req, res, next) => {
  try {
    const [
      totalExercises,
      totalSessions,
      completedSessions,
      upcomingSessions,
      exercisesByPhase,
      exercisesByDifficulty
    ] = await Promise.all([
      // Total exercises
      prisma.exercise.count(),
      
      // Total sessions
      prisma.session.count(),
      
      // Completed sessions
      prisma.session.count({
        where: { status: 'COMPLETED' }
      }),
      
      // Upcoming sessions
      prisma.session.count({
        where: {
          status: 'PLANNED',
          scheduledDate: { gte: new Date() }
        }
      }),
      
      // Exercises by phase
      prisma.exercise.groupBy({
        by: ['phase'],
        _count: true
      }),
      
      // Exercises by difficulty
      prisma.exercise.groupBy({
        by: ['difficulty'],
        _count: true
      })
    ]);

    // Recent training history
    const recentTraining = await prisma.trainingHistory.findMany({
      take: 10,
      include: {
        exercise: true,
        session: true
      },
      orderBy: { completedAt: 'desc' }
    });

    res.json({
      overview: {
        totalExercises,
        totalSessions,
        completedSessions,
        upcomingSessions
      },
      exercisesByPhase: exercisesByPhase.map(item => ({
        phase: item.phase,
        count: item._count
      })),
      exercisesByDifficulty: exercisesByDifficulty.map(item => ({
        difficulty: item.difficulty,
        count: item._count
      })),
      recentTraining
    });
  } catch (error) {
    next(error);
  }
};

// Get stats for a specific period
export const getStatsByPeriod = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {
      completedAt: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined
      }
    };

    const [completedSessions, totalTrainingTime] = await Promise.all([
      // Sessions completed in period
      prisma.session.count({
        where: {
          status: 'COMPLETED',
          ...dateFilter
        }
      }),
      
      // Total training time (sum of all exercise durations)
      prisma.trainingHistory.findMany({
        where: dateFilter,
        include: {
          exercise: true
        }
      })
    ]);

    const totalTime = totalTrainingTime.reduce((sum, history) => {
      return sum + (history.exercise.duration || 0);
    }, 0);

    res.json({
      period: {
        startDate: startDate || 'all time',
        endDate: endDate || 'now'
      },
      completedSessions,
      totalTrainingTime: totalTime,
      averageSessionTime: completedSessions > 0 ? Math.round(totalTime / completedSessions) : 0
    });
  } catch (error) {
    next(error);
  }
};