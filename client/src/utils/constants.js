export const PHASES = {
  WARM_UP: {
    value: 'WARM_UP',
    label: 'Échauffement',
    color: 'bg-blue-500',
    textColor: 'text-blue-600'
  },
  REGULARITY: {
    value: 'REGULARITY',
    label: 'Régularité',
    color: 'bg-green-500',
    textColor: 'text-green-600'
  },
  UNCERTAINTY: {
    value: 'UNCERTAINTY',
    label: 'Incertitude',
    color: 'bg-orange-500',
    textColor: 'text-orange-600'
  },
  MATCH_SITUATION: {
    value: 'MATCH_SITUATION',
    label: 'Situation de match',
    color: 'bg-red-500',
    textColor: 'text-red-600'
  }
}

export const DIFFICULTIES = {
  BEGINNER: {
    value: 'BEGINNER',
    label: 'Débutant',
    color: 'bg-green-400',
    textColor: 'text-green-600'
  },
  INTERMEDIATE: {
    value: 'INTERMEDIATE',
    label: 'Intermédiaire',
    color: 'bg-yellow-400',
    textColor: 'text-yellow-600'
  },
  ADVANCED: {
    value: 'ADVANCED',
    label: 'Avancé',
    color: 'bg-orange-400',
    textColor: 'text-orange-600'
  },
  EXPERT: {
    value: 'EXPERT',
    label: 'Expert',
    color: 'bg-red-400',
    textColor: 'text-red-600'
  }
}

export const SESSION_STATUS = {
  PLANNED: {
    value: 'PLANNED',
    label: 'Planifiée',
    color: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  IN_PROGRESS: {
    value: 'IN_PROGRESS',
    label: 'En cours',
    color: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  },
  COMPLETED: {
    value: 'COMPLETED',
    label: 'Terminée',
    color: 'bg-green-100',
    textColor: 'text-green-800'
  },
  CANCELLED: {
    value: 'CANCELLED',
    label: 'Annulée',
    color: 'bg-gray-100',
    textColor: 'text-gray-800'
  }
}

export const SHOT_TYPES = {
  FOREHAND: 'Coup droit',
  BACKHAND: 'Revers',
  SERVICE: 'Service',
  PUSH: 'Poussette',
  FLICK: 'Flip',
  CHOP: 'Défense coupée',
  BLOCK: 'Bloc',
  SMASH: 'Smash',
  LOB: 'Lob'
}

export const SPIN_TYPES = {
  TOPSPIN: 'Lift',
  HEAVY_TOPSPIN: 'Lift puissant',
  BACKSPIN: 'Coupé',
  HEAVY_BACKSPIN: 'Très coupé',
  SIDESPIN: 'Effet latéral',
  NEUTRAL: 'Sans effet',
  MIXED: 'Effet mixte'
}

export const SPEED_TYPES = {
  SLOW: 'Lent',
  MEDIUM: 'Moyen',
  FAST: 'Rapide',
  VERY_FAST: 'Très rapide',
  VARIABLE: 'Variable'
}

// Table dimensions in pixels (for canvas)
export const TABLE_DIMENSIONS = {
  WIDTH: 548,  // 274cm * 2 (scale factor)
  HEIGHT: 305, // 152.5cm * 2 (scale factor)
  NET_HEIGHT: 30,
  MARGIN: 50
}

// Helper functions
export const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export const formatDateTime = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}