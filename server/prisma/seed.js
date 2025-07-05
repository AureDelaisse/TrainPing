import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const exercises = [
  {
    title: "Échauffement - Échanges réguliers",
    description: "Échanges coup droit/revers en diagonale pour s'échauffer progressivement",
    phase: "WARM_UP",
    duration: 300,
    repetitions: 1,
    difficulty: "BEGINNER",
    shots: [
      {
        id: "shot1",
        startPosition: { x: 0.2, y: 0.3 },
        endPosition: { x: 0.8, y: 0.7 },
        type: "FOREHAND",
        spin: "TOPSPIN",
        speed: "MEDIUM",
        playerSide: "PLAYER"
      },
      {
        id: "shot2",
        startPosition: { x: 0.8, y: 0.7 },
        endPosition: { x: 0.2, y: 0.3 },
        type: "BACKHAND",
        spin: "TOPSPIN",
        speed: "MEDIUM",
        playerSide: "OPPONENT"
      }
    ]
  },
  {
    title: "Services courts variés",
    description: "Pratique de services courts avec différents effets (coupé, lifté, latéral)",
    phase: "REGULARITY",
    duration: 600,
    repetitions: 3,
    difficulty: "INTERMEDIATE",
    shots: [
      {
        id: "shot1",
        startPosition: { x: 0.1, y: 0.5 },
        endPosition: { x: 0.6, y: 0.4 },
        type: "SERVICE",
        spin: "BACKSPIN",
        speed: "SLOW",
        playerSide: "PLAYER"
      }
    ]
  },
  {
    title: "Top spin coup droit en régularité",
    description: "Enchaînement de tops spin coup droit sur la même diagonale",
    phase: "REGULARITY",
    duration: 480,
    repetitions: 2,
    difficulty: "INTERMEDIATE",
    shots: [
      {
        id: "shot1",
        startPosition: { x: 0.3, y: 0.3 },
        endPosition: { x: 0.7, y: 0.7 },
        type: "FOREHAND",
        spin: "HEAVY_TOPSPIN",
        speed: "FAST",
        playerSide: "PLAYER"
      },
      {
        id: "shot2",
        startPosition: { x: 0.7, y: 0.7 },
        endPosition: { x: 0.3, y: 0.3 },
        type: "BLOCK",
        spin: "NEUTRAL",
        speed: "MEDIUM",
        playerSide: "OPPONENT"
      }
    ]
  },
  {
    title: "Déplacements latéraux avec changement de diagonale",
    description: "Travail du jeu de jambes avec alternance coup droit/revers sur toute la table",
    phase: "UNCERTAINTY",
    duration: 720,
    repetitions: 2,
    difficulty: "ADVANCED",
    shots: [
      {
        id: "shot1",
        startPosition: { x: 0.2, y: 0.3 },
        endPosition: { x: 0.8, y: 0.7 },
        type: "FOREHAND",
        spin: "TOPSPIN",
        speed: "FAST",
        playerSide: "PLAYER"
      },
      {
        id: "shot2",
        startPosition: { x: 0.8, y: 0.7 },
        endPosition: { x: 0.8, y: 0.3 },
        type: "BACKHAND",
        spin: "TOPSPIN",
        speed: "FAST",
        playerSide: "OPPONENT"
      },
      {
        id: "shot3",
        startPosition: { x: 0.8, y: 0.3 },
        endPosition: { x: 0.2, y: 0.7 },
        type: "BACKHAND",
        spin: "TOPSPIN",
        speed: "FAST",
        playerSide: "PLAYER"
      }
    ]
  },
  {
    title: "Contre-attaque sur service long",
    description: "Réception aggressive de services longs avec top spin ou frappe",
    phase: "MATCH_SITUATION",
    duration: 600,
    repetitions: 3,
    difficulty: "ADVANCED",
    shots: [
      {
        id: "shot1",
        startPosition: { x: 0.9, y: 0.5 },
        endPosition: { x: 0.1, y: 0.5 },
        type: "SERVICE",
        spin: "TOPSPIN",
        speed: "FAST",
        playerSide: "OPPONENT"
      },
      {
        id: "shot2",
        startPosition: { x: 0.1, y: 0.5 },
        endPosition: { x: 0.8, y: 0.3 },
        type: "FOREHAND",
        spin: "HEAVY_TOPSPIN",
        speed: "VERY_FAST",
        playerSide: "PLAYER"
      }
    ]
  },
  {
    title: "Poussettes et remises courtes",
    description: "Échanges courts près du filet avec variations de placement",
    phase: "REGULARITY",
    duration: 480,
    repetitions: 2,
    difficulty: "BEGINNER",
    shots: [
      {
        id: "shot1",
        startPosition: { x: 0.4, y: 0.4 },
        endPosition: { x: 0.6, y: 0.4 },
        type: "PUSH",
        spin: "BACKSPIN",
        speed: "SLOW",
        playerSide: "PLAYER"
      },
      {
        id: "shot2",
        startPosition: { x: 0.6, y: 0.4 },
        endPosition: { x: 0.4, y: 0.6 },
        type: "PUSH",
        spin: "BACKSPIN",
        speed: "SLOW",
        playerSide: "OPPONENT"
      }
    ]
  },
  {
    title: "Schéma tactique : Service court + 3ème balle",
    description: "Service court suivi d'une attaque sur la remise de l'adversaire",
    phase: "MATCH_SITUATION",
    duration: 900,
    repetitions: 4,
    difficulty: "EXPERT",
    shots: [
      {
        id: "shot1",
        startPosition: { x: 0.1, y: 0.5 },
        endPosition: { x: 0.6, y: 0.4 },
        type: "SERVICE",
        spin: "SIDESPIN",
        speed: "SLOW",
        playerSide: "PLAYER"
      },
      {
        id: "shot2",
        startPosition: { x: 0.6, y: 0.4 },
        endPosition: { x: 0.3, y: 0.6 },
        type: "FLICK",
        spin: "TOPSPIN",
        speed: "MEDIUM",
        playerSide: "OPPONENT"
      },
      {
        id: "shot3",
        startPosition: { x: 0.3, y: 0.6 },
        endPosition: { x: 0.9, y: 0.2 },
        type: "FOREHAND",
        spin: "HEAVY_TOPSPIN",
        speed: "VERY_FAST",
        playerSide: "PLAYER"
      }
    ]
  },
  {
    title: "Défense coupée alternée",
    description: "Pratique de la défense en reculant de la table avec coups coupés",
    phase: "REGULARITY",
    duration: 600,
    repetitions: 2,
    difficulty: "INTERMEDIATE",
    shots: [
      {
        id: "shot1",
        startPosition: { x: 0.2, y: 0.8 },
        endPosition: { x: 0.8, y: 0.2 },
        type: "CHOP",
        spin: "HEAVY_BACKSPIN",
        speed: "SLOW",
        playerSide: "PLAYER"
      },
      {
        id: "shot2",
        startPosition: { x: 0.8, y: 0.2 },
        endPosition: { x: 0.8, y: 0.8 },
        type: "CHOP",
        spin: "HEAVY_BACKSPIN",
        speed: "SLOW",
        playerSide: "PLAYER"
      }
    ]
  },
  {
    title: "Jeu à mi-distance avec variations",
    description: "Échanges à mi-distance avec alternance de rythme et d'effets",
    phase: "UNCERTAINTY",
    duration: 840,
    repetitions: 3,
    difficulty: "EXPERT",
    shots: [
      {
        id: "shot1",
        startPosition: { x: 0.3, y: 0.5 },
        endPosition: { x: 0.7, y: 0.5 },
        type: "FOREHAND",
        spin: "TOPSPIN",
        speed: "VARIABLE",
        playerSide: "PLAYER"
      },
      {
        id: "shot2",
        startPosition: { x: 0.7, y: 0.5 },
        endPosition: { x: 0.3, y: 0.7 },
        type: "BACKHAND",
        spin: "MIXED",
        speed: "VARIABLE",
        playerSide: "OPPONENT"
      }
    ]
  },
  {
    title: "Smash et contre-smash",
    description: "Travail des balles hautes avec smash et défense sur smash adverse",
    phase: "UNCERTAINTY",
    duration: 420,
    repetitions: 2,
    difficulty: "ADVANCED",
    shots: [
      {
        id: "shot1",
        startPosition: { x: 0.5, y: 0.8 },
        endPosition: { x: 0.5, y: 0.2 },
        type: "LOB",
        spin: "TOPSPIN",
        speed: "SLOW",
        playerSide: "OPPONENT"
      },
      {
        id: "shot2",
        startPosition: { x: 0.5, y: 0.2 },
        endPosition: { x: 0.8, y: 0.9 },
        type: "SMASH",
        spin: "NEUTRAL",
        speed: "VERY_FAST",
        playerSide: "PLAYER"
      }
    ]
  }
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.trainingHistory.deleteMany();
  await prisma.sessionExercise.deleteMany();
  await prisma.session.deleteMany();
  await prisma.exercise.deleteMany();

  // Create exercises
  for (const exercise of exercises) {
    await prisma.exercise.create({
      data: exercise
    });
  }

  console.log(`✅ Created ${exercises.length} exercises`);

  // Create sample sessions
  const exerciseRecords = await prisma.exercise.findMany();
  
  const sessions = [
    {
      title: "Séance découverte - Débutants",
      description: "Séance d'initiation pour nouveaux joueurs",
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      estimatedDuration: 60,
      status: "PLANNED",
      exercises: exerciseRecords
        .filter(e => e.difficulty === "BEGINNER")
        .slice(0, 3)
        .map((e, idx) => ({ exerciseId: e.id, order: idx + 1 }))
    },
    {
      title: "Entraînement intensif - Top spin",
      description: "Focus sur l'amélioration du top spin coup droit et revers",
      scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // In 3 days
      estimatedDuration: 90,
      status: "PLANNED",
      exercises: exerciseRecords
        .filter(e => e.title.toLowerCase().includes("top") || e.phase === "REGULARITY")
        .slice(0, 4)
        .map((e, idx) => ({ exerciseId: e.id, order: idx + 1 }))
    },
    {
      title: "Préparation compétition",
      description: "Séance complète avec situations de match",
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // In a week
      estimatedDuration: 120,
      status: "PLANNED",
      exercises: exerciseRecords
        .filter(e => e.phase === "MATCH_SITUATION" || e.difficulty === "ADVANCED" || e.difficulty === "EXPERT")
        .slice(0, 5)
        .map((e, idx) => ({ exerciseId: e.id, order: idx + 1 }))
    }
  ];

  for (const sessionData of sessions) {
    const { exercises, ...session } = sessionData;
    await prisma.session.create({
      data: {
        ...session,
        exercises: {
          create: exercises
        }
      }
    });
  }

  console.log(`✅ Created ${sessions.length} sessions`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });