<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Loading -->
    <div v-if="trainingStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-table-green-600 mx-auto"></div>
      <p class="mt-4 text-lg text-gray-600">Préparation de l'entraînement...</p>
    </div>

    <!-- Error -->
    <div v-else-if="trainingStore.error" class="card p-6 border-red-200 bg-red-50">
      <h3 class="text-lg font-medium text-red-800 mb-2">Erreur</h3>
      <p class="text-red-600">{{ trainingStore.error }}</p>
      <div class="mt-4">
        <router-link to="/sessions" class="btn-secondary">
          Retour aux sessions
        </router-link>
      </div>
    </div>

    <!-- Training Interface -->
    <div v-else-if="trainingStore.activeSession">
      <!-- Session Header -->
      <div class="card p-6">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ trainingStore.activeSession.title }}</h1>
            <p v-if="trainingStore.activeSession.description" class="mt-1 text-gray-600">
              {{ trainingStore.activeSession.description }}
            </p>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">Progression</div>
            <div class="text-2xl font-bold text-table-green-600">
              {{ trainingStore.progress }}%
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mt-4">
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>Exercice {{ currentExerciseIndex + 1 }} sur {{ totalExercises }}</span>
            <span>{{ remainingExercises }} restant(s)</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-table-green-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${trainingStore.progress}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Current Exercise -->
      <div v-if="currentExercise" class="card p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Exercise Info -->
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ currentExercise.exercise.title }}</h2>
            <p class="text-gray-600 mb-6">{{ currentExercise.exercise.description }}</p>

            <!-- Exercise Details -->
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">Phase:</span>
                <span :class="[getPhaseInfo(currentExercise.exercise.phase).textColor, 'text-sm font-medium']">
                  {{ getPhaseInfo(currentExercise.exercise.phase).label }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">Difficulté:</span>
                <span :class="[getDifficultyInfo(currentExercise.exercise.difficulty).textColor, 'text-sm font-medium']">
                  {{ getDifficultyInfo(currentExercise.exercise.difficulty).label }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">Durée:</span>
                <span class="text-sm font-medium text-gray-900">{{ formatDuration(currentExercise.exercise.duration) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-500">Répétitions:</span>
                <span class="text-sm font-medium text-gray-900">{{ currentExercise.exercise.repetitions }}</span>
              </div>
            </div>
          </div>

          <!-- Timer/Controls -->
          <div class="flex flex-col items-center justify-center">
            <!-- Timer Display -->
            <div class="relative w-48 h-48 mb-6">
              <!-- SVG Circle Progress -->
              <svg class="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  class="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  class="text-table-green-600"
                  :stroke-dasharray="`${timerProgress * 283} 283`"
                />
              </svg>
              
              <!-- Timer Text -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-3xl font-bold text-gray-900">{{ formatTime(currentTime) }}</div>
                  <div class="text-sm text-gray-500">{{ isPaused ? 'Pause' : 'En cours' }}</div>
                </div>
              </div>
            </div>

            <!-- Control Buttons -->
            <div class="flex space-x-3">
              <button
                v-if="currentExerciseIndex > 0"
                @click="previousExercise"
                class="btn-secondary"
              >
                <ChevronLeftIcon class="h-5 w-5" />
              </button>

              <button
                @click="togglePause"
                class="btn-primary px-6"
              >
                <PauseIcon v-if="!isPaused" class="h-5 w-5" />
                <PlayIcon v-else class="h-5 w-5" />
              </button>

              <button
                @click="skipExercise"
                class="btn-secondary"
              >
                <ChevronRightIcon class="h-5 w-5" />
              </button>
            </div>

            <!-- Complete Exercise -->
            <button
              @click="showCompleteModal = true"
              class="mt-4 btn bg-green-600 text-white hover:bg-green-700"
            >
              <CheckIcon class="h-5 w-5 mr-2" />
              Terminer l'exercice
            </button>
          </div>
        </div>
      </div>

      <!-- Exercise List -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Exercices de la session</h3>
        <div class="space-y-3">
          <div
            v-for="(exercise, index) in trainingStore.activeSession.exercises"
            :key="exercise.id"
            class="flex items-center justify-between p-3 rounded-lg border"
            :class="[
              index === currentExerciseIndex ? 'border-table-green-500 bg-table-green-50' : 'border-gray-200',
              index < currentExerciseIndex ? 'bg-green-50 border-green-200' : ''
            ]"
          >
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                  :class="[
                    index < currentExerciseIndex ? 'bg-green-500 text-white' : 
                    index === currentExerciseIndex ? 'bg-table-green-600 text-white' : 
                    'bg-gray-200 text-gray-600'
                  ]"
                >
                  <CheckIcon v-if="index < currentExerciseIndex" class="h-4 w-4" />
                  <span v-else>{{ index + 1 }}</span>
                </div>
              </div>
              <div>
                <h4 class="font-medium text-gray-900">{{ exercise.exercise.title }}</h4>
                <p class="text-sm text-gray-500">{{ formatDuration(exercise.exercise.duration) }}</p>
              </div>
            </div>
            <div v-if="index === currentExerciseIndex" class="text-sm font-medium text-table-green-600">
              En cours
            </div>
            <div v-else-if="index < currentExerciseIndex" class="text-sm font-medium text-green-600">
              Terminé
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Complete Exercise Modal -->
    <div v-if="showCompleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="card p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Terminer l'exercice</h3>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Notes (optionnel)</label>
          <textarea
            v-model="exerciseNotes"
            rows="3"
            placeholder="Commentaires sur l'exercice..."
            class="input"
          ></textarea>
        </div>
        <div class="flex space-x-3">
          <button @click="showCompleteModal = false" class="btn-secondary flex-1">
            Annuler
          </button>
          <button @click="completeExercise" class="btn-primary flex-1">
            Valider
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTrainingStore } from '../stores/training'
import { PHASES, DIFFICULTIES, formatDuration } from '../utils/constants'
import {
  PlayIcon,
  PauseIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const trainingStore = useTrainingStore()

const showCompleteModal = ref(false)
const exerciseNotes = ref('')
const timer = ref(null)
const currentTime = ref(0)

const currentExercise = computed(() => trainingStore.currentExercise)
const currentExerciseIndex = computed(() => trainingStore.currentExerciseIndex)
const totalExercises = computed(() => trainingStore.totalExercises)
const remainingExercises = computed(() => trainingStore.remainingExercises)
const isPaused = computed(() => trainingStore.isPaused)

const timerProgress = computed(() => {
  if (!currentExercise.value) return 0
  const duration = currentExercise.value.exercise.duration
  return Math.min(currentTime.value / duration, 1)
})

const getPhaseInfo = (phase) => PHASES[phase] || { label: phase, textColor: 'text-gray-600' }
const getDifficultyInfo = (difficulty) => DIFFICULTIES[difficulty] || { label: difficulty, textColor: 'text-gray-600' }

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const startTimer = () => {
  if (timer.value) clearInterval(timer.value)
  
  timer.value = setInterval(() => {
    if (!isPaused.value && trainingStore.isRunning) {
      currentTime.value++
      
      // Auto-complete when time is up
      if (currentExercise.value && currentTime.value >= currentExercise.value.exercise.duration) {
        showCompleteModal.value = true
      }
    }
  }, 1000)
}

const togglePause = () => {
  if (isPaused.value) {
    trainingStore.resumeTraining()
  } else {
    trainingStore.pauseTraining()
  }
}

const skipExercise = () => {
  trainingStore.skipExercise()
  currentTime.value = 0
}

const previousExercise = () => {
  trainingStore.previousExercise()
  currentTime.value = 0
}

const completeExercise = async () => {
  try {
    await trainingStore.completeCurrentExercise(exerciseNotes.value)
    
    exerciseNotes.value = ''
    showCompleteModal.value = false
    currentTime.value = 0
    
    // Check if training is complete
    if (!trainingStore.isRunning) {
      alert('Félicitations ! Vous avez terminé la session d\'entraînement.')
      router.push('/sessions')
    }
  } catch (error) {
    console.error('Error completing exercise:', error)
  }
}

onMounted(async () => {
  const sessionId = route.params.sessionId
  try {
    await trainingStore.startTraining(sessionId)
    startTimer()
  } catch (error) {
    console.error('Error starting training:', error)
  }
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  trainingStore.resetTraining()
})
</script>