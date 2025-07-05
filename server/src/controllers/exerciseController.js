import { prisma } from '../index.js';

// Get all exercises with filters
export const getExercises = async (req, res, next) => {
  try {
    const { phase, difficulty, search } = req.query;
    
    const where = {};
    
    if (phase) where.phase = phase;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(exercises);
  } catch (error) {
    next(error);
  }
};

// Get single exercise
export const getExercise = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: {
        _count: {
          select: { sessionExercises: true }
        }
      }
    });

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.json(exercise);
  } catch (error) {
    next(error);
  }
};

// Create exercise
export const createExercise = async (req, res, next) => {
  try {
    const { title, description, phase, duration, repetitions, difficulty, shots } = req.body;

    const exercise = await prisma.exercise.create({
      data: {
        title,
        description,
        phase,
        duration,
        repetitions,
        difficulty,
        shots: shots || []
      }
    });

    res.status(201).json(exercise);
  } catch (error) {
    next(error);
  }
};

// Update exercise
export const updateExercise = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const exercise = await prisma.exercise.update({
      where: { id },
      data: updateData
    });

    res.json(exercise);
  } catch (error) {
    next(error);
  }
};

// Delete exercise
export const deleteExercise = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if exercise is used in any sessions
    const sessionCount = await prisma.sessionExercise.count({
      where: { exerciseId: id }
    });

    if (sessionCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete exercise',
        message: `This exercise is used in ${sessionCount} session(s)`
      });
    }

    await prisma.exercise.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};