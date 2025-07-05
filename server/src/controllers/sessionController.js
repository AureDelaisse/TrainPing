import { prisma } from '../index.js';

// Get all sessions with filters
export const getSessions = async (req, res, next) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    const where = {};
    
    if (status) where.status = status;
    if (startDate || endDate) {
      where.scheduledDate = {};
      if (startDate) where.scheduledDate.gte = new Date(startDate);
      if (endDate) where.scheduledDate.lte = new Date(endDate);
    }

    const sessions = await prisma.session.findMany({
      where,
      include: {
        exercises: {
          include: {
            exercise: true
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { scheduledDate: 'asc' }
    });

    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

// Get single session with exercises
export const getSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        exercises: {
          include: {
            exercise: true
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    next(error);
  }
};

// Create session
export const createSession = async (req, res, next) => {
  try {
    const { title, description, scheduledDate, estimatedDuration, exercises } = req.body;

    const session = await prisma.session.create({
      data: {
        title,
        description,
        scheduledDate: new Date(scheduledDate),
        estimatedDuration,
        exercises: {
          create: exercises?.map((ex, index) => ({
            exerciseId: ex.exerciseId,
            order: index + 1
          })) || []
        }
      },
      include: {
        exercises: {
          include: {
            exercise: true
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

// Update session
export const updateSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, scheduledDate, estimatedDuration, status, exercises } = req.body;

    // Start a transaction to update session and manage exercises
    const session = await prisma.$transaction(async (tx) => {
      // Update session basic info
      const updatedSession = await tx.session.update({
        where: { id },
        data: {
          title,
          description,
          scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
          estimatedDuration,
          status,
          completedAt: status === 'COMPLETED' ? new Date() : undefined
        }
      });

      // If exercises are provided, update them
      if (exercises !== undefined) {
        // Delete existing exercises
        await tx.sessionExercise.deleteMany({
          where: { sessionId: id }
        });

        // Create new exercises
        if (exercises.length > 0) {
          await tx.sessionExercise.createMany({
            data: exercises.map((ex, index) => ({
              sessionId: id,
              exerciseId: ex.exerciseId,
              order: index + 1
            }))
          });
        }
      }

      // Return the updated session with exercises
      return await tx.session.findUnique({
        where: { id },
        include: {
          exercises: {
            include: {
              exercise: true
            },
            orderBy: { order: 'asc' }
          }
        }
      });
    });

    res.json(session);
  } catch (error) {
    next(error);
  }
};

// Delete session
export const deleteSession = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.session.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Duplicate session
export const duplicateSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, scheduledDate } = req.body;

    // Get the original session
    const originalSession = await prisma.session.findUnique({
      where: { id },
      include: {
        exercises: true
      }
    });

    if (!originalSession) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Create a new session with the same exercises
    const newSession = await prisma.session.create({
      data: {
        title: title || `${originalSession.title} (copie)`,
        description: originalSession.description,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
        estimatedDuration: originalSession.estimatedDuration,
        status: 'PLANNED',
        exercises: {
          create: originalSession.exercises.map(ex => ({
            exerciseId: ex.exerciseId,
            order: ex.order
          }))
        }
      },
      include: {
        exercises: {
          include: {
            exercise: true
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    res.status(201).json(newSession);
  } catch (error) {
    next(error);
  }
};