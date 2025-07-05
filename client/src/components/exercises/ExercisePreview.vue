<template>
  <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <!-- Preview header -->
    <div class="flex items-center justify-between mb-4">
      <h4 class="font-semibold text-gray-900">{{ exercise.title || 'Titre de l\'exercice' }}</h4>
      <div class="flex items-center space-x-2">
        <span :class="phaseColorClass" class="px-2 py-1 text-xs font-medium rounded-full">
          {{ phaseLabel }}
        </span>
        <span :class="difficultyColorClass" class="px-2 py-1 text-xs font-medium rounded-full">
          {{ difficultyLabel }}
        </span>
      </div>
    </div>
    
    <!-- Preview content -->
    <div class="space-y-3">
      <!-- Description -->
      <p v-if="exercise.description" class="text-sm text-gray-600">
        {{ exercise.description }}
      </p>
      <p v-else class="text-sm text-gray-400 italic">
        Ajoutez une description pour expliquer l'exercice...
      </p>
      
      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 text-center">
        <div class="bg-white rounded-lg p-3 border border-gray-100">
          <div class="text-lg font-semibold text-gray-900">
            {{ formatDuration(exercise.duration) }}
          </div>
          <div class="text-xs text-gray-500">Durée</div>
        </div>
        
        <div class="bg-white rounded-lg p-3 border border-gray-100">
          <div class="text-lg font-semibold text-gray-900">
            {{ exercise.repetitions || 1 }}
          </div>
          <div class="text-xs text-gray-500">Répétitions</div>
        </div>
        
        <div class="bg-white rounded-lg p-3 border border-gray-100">
          <div class="text-lg font-semibold text-gray-900">
            {{ exercise.shots?.length || 0 }}
          </div>
          <div class="text-xs text-gray-500">Trajectoires</div>
        </div>
      </div>
      
      <!-- Shot summary -->
      <div v-if="exercise.shots && exercise.shots.length > 0" class="mt-4">
        <h5 class="text-sm font-medium text-gray-900 mb-2">Trajectoires</h5>
        <div class="space-y-1">
          <div
            v-for="(shot, index) in exercise.shots"
            :key="index"
            class="flex items-center justify-between text-xs bg-white rounded px-2 py-1 border border-gray-100"
          >
            <span class="font-medium">{{ index + 1 }}. {{ getShotTypeLabel(shot.type) }}</span>
            <div class="flex items-center space-x-1">
              <span class="text-gray-500">{{ getShotSpinLabel(shot.spin) }}</span>
              <span class="text-gray-400">•</span>
              <span class="text-gray-500">{{ getShotSpeedLabel(shot.speed) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { PHASES, DIFFICULTIES, formatDuration } from '../../utils/constants'

const props = defineProps({
  exercise: {
    type: Object,
    required: true
  }
})

// Computed properties for labels and colors
const phaseLabel = computed(() => {
  const phase = Object.values(PHASES).find(p => p.value === props.exercise.phase)
  return phase ? phase.label : 'Phase non définie'
})

const difficultyLabel = computed(() => {
  const difficulty = Object.values(DIFFICULTIES).find(d => d.value === props.exercise.difficulty)
  return difficulty ? difficulty.label : 'Difficulté non définie'
})

const phaseColorClass = computed(() => {
  switch (props.exercise.phase) {
    case 'WARM_UP':
      return 'bg-orange-100 text-orange-800'
    case 'REGULARITY':
      return 'bg-blue-100 text-blue-800'
    case 'UNCERTAINTY':
      return 'bg-purple-100 text-purple-800'
    case 'MATCH_SITUATION':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

const difficultyColorClass = computed(() => {
  switch (props.exercise.difficulty) {
    case 'BEGINNER':
      return 'bg-green-100 text-green-800'
    case 'INTERMEDIATE':
      return 'bg-yellow-100 text-yellow-800'
    case 'ADVANCED':
      return 'bg-orange-100 text-orange-800'
    case 'EXPERT':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

// Helper functions for shot labels
const getShotTypeLabel = (type) => {
  const types = {
    'SERVE': 'Service',
    'DRIVE': 'Drive',
    'TOPSPIN': 'Top spin',
    'BACKSPIN': 'Back spin',
    'SIDESPIN': 'Side spin',
    'SMASH': 'Smash',
    'PUSH': 'Poussette',
    'BLOCK': 'Bloc'
  }
  return types[type] || type
}

const getShotSpinLabel = (spin) => {
  const spins = {
    'NONE': 'Sans effet',
    'TOPSPIN': 'Lifté',
    'BACKSPIN': 'Coupé',
    'SIDESPIN': 'Latéral'
  }
  return spins[spin] || spin
}

const getShotSpeedLabel = (speed) => {
  const speeds = {
    'SLOW': 'Lent',
    'MEDIUM': 'Moyen',
    'FAST': 'Rapide'
  }
  return speeds[speed] || speed
}
</script>