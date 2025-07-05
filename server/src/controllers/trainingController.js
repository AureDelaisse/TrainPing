import { prisma } from '../index.js';

// Start a training session
export const startTraining = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    // Update session status
    const session = await prisma.session.update({
      where: { id: sessionId },
      data: { status: 'IN_PROGRESS' },
      include: {
        exercises: {
          include: {
            exercise: true
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    res.json(session);
  } catch (error) {
    next(error);
  }
};

// Record exercise completion
export const completeExercise = async (req, res, next) => {
  try {
    const { exerciseId } = req.params;
    const { sessionId, notes } = req.body;

    const history = await prisma.trainingHistory.create({
      data: {
        sessionId,
        exerciseId,
        startedAt: new Date(),
        completedAt: new Date(),
        notes
      }
    });

    res.status(201).json(history);
  } catch (error) {
    next(error);
  }
};

// Complete a training session
export const completeTraining = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const session = await prisma.session.update({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });

    res.json(session);
  } catch (error) {
    next(error);
  }
};

// Get training history for a session
export const getTrainingHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const history = await prisma.trainingHistory.findMany({
      where: { sessionId },
      include: {
        exercise: true
      },
      orderBy: { startedAt: 'asc' }
    });

    res.json(history);
  } catch (error) {
    next(error);
  }
};