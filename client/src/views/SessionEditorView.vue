<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isEdit ? 'Modifier la session' : 'Nouvelle session' }}
        </h1>
        <p class="mt-1 text-sm text-gray-600">
          {{ isEdit ? 'Modifiez les détails de la session' : 'Créez une nouvelle session d\'entraînement' }}
        </p>
      </div>
      <router-link to="/sessions" class="btn-secondary">
        Retour
      </router-link>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Session Form -->
      <div class="lg:col-span-2 space-y-6">
        <form @submit.prevent="saveSession">
          <!-- Basic Info -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations de base</h3>
            
            <div class="space-y-4">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                <input
                  v-model="form.title"
                  type="text"
                  required
                  placeholder="Ex: Entraînement intensif - Top spin"
                  class="input"
                />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  placeholder="Décrivez les objectifs de la session..."
                  class="input"
                ></textarea>
              </div>

              <!-- Date and Duration -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Date programmée *</label>
                  <input
                    v-model="form.scheduledDate"
                    type="datetime-local"
                    required
                    class="input"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Durée estimée (min) *</label>
                  <input
                    v-model.number="form.estimatedDuration"
                    type="number"
                    min="15"
                    max="180"
                    required
                    placeholder="60"
                    class="input"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Selected Exercises -->
          <div class="card p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Exercices sélectionnés</h3>
              <span class="text-sm text-gray-500">{{ selectedExercises.length }} exercice(s)</span>
            </div>

            <div v-if="selectedExercises.length === 0" class="text-center py-8 text-gray-500">
              Aucun exercice sélectionné. Utilisez la liste à droite pour ajouter des exercices.
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(exercise, index) in selectedExercises"
                :key="exercise.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-table-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">{{ exercise.title }}</h4>
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{{ formatDuration(exercise.duration) }}</span>
                      <span :class="getPhaseInfo(exercise.phase).textColor">
                        {{ getPhaseInfo(exercise.phase).label }}
                      </span>
                      <span :class="getDifficultyInfo(exercise.difficulty).textColor">
                        {{ getDifficultyInfo(exercise.difficulty).label }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center space-x-2">
                  <button
                    v-if="index > 0"
                    type="button"
                    @click="moveExercise(index, index - 1)"
                    class="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <ChevronUpIcon class="h-4 w-4" />
                  </button>
                  <button
                    v-if="index < selectedExercises.length - 1"
                    type="button"
                    @click="moveExercise(index, index + 1)"
                    class="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <ChevronDownIcon class="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    @click="removeExercise(index)"
                    class="p-1 text-gray-400 hover:text-red-600"
                  >
                    <XMarkIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Summary -->
            <div v-if="selectedExercises.length > 0" class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Durée totale estimée:</span>
                <span class="font-medium">{{ formatDuration(totalDuration) }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-4">
            <router-link to="/sessions" class="btn-secondary">
              Annuler
            </router-link>
            <button
              type="submit"
              :disabled="loading || selectedExercises.length === 0"
              class="btn-primary"
            >
              <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {{ isEdit ? 'Mettre à jour' : 'Créer la session' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Exercise Library -->
      <div class="space-y-6">
        <!-- Search -->
        <div class="card p-4">
          <h3 class="font-semibold text-gray-900 mb-3">Bibliothèque d'exercices</h3>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un exercice..."
            class="input mb-3"
          />
          
          <!-- Filters -->
          <div class="space-y-2">
            <select v-model="filterPhase" class="input text-sm">
              <option value="">Toutes les phases</option>
              <option v-for="phase in Object.values(PHASES)" :key="phase.value" :value="phase.value">
                {{ phase.label }}
              </option>
            </select>
            
            <select v-model="filterDifficulty" class="input text-sm">
              <option value="">Toutes les difficultés</option>
              <option v-for="difficulty in Object.values(DIFFICULTIES)" :key="difficulty.value" :value="difficulty.value">
                {{ difficulty.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Exercise List -->
        <div class="card p-4 max-h-96 overflow-y-auto">
          <div v-if="filteredAvailableExercises.length === 0" class="text-center py-4 text-gray-500 text-sm">
            Aucun exercice disponible
          </div>
          
          <div v-else class="space-y-2">
            <div
              v-for="exercise in filteredAvailableExercises"
              :key="exercise.id"
              class="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              @click="addExercise(exercise)"
            >
              <h4 class="font-medium text-gray-900 text-sm">{{ exercise.title }}</h4>
              <div class="flex items-center justify-between mt-1">
                <span class="text-xs text-gray-500">{{ formatDuration(exercise.duration) }}</span>
                <div class="flex space-x-1">
                  <span :class="[getPhaseInfo(exercise.phase).color, 'w-2 h-2 rounded-full']"></span>
                  <span :class="[getDifficultyInfo(exercise.difficulty).color, 'w-2 h-2 rounded-full']"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from '../stores/sessions'
import { useExerciseStore } from '../stores/exercises'
import { PHASES, DIFFICULTIES, formatDuration } from '../utils/constants'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const sessionStore = useSessionStore()
const exerciseStore = useExerciseStore()

const loading = ref(false)
const isEdit = computed(() => !!route.params.id)

const searchQuery = ref('')
const filterPhase = ref('')
const filterDifficulty = ref('')

const form = ref({
  title: '',
  description: '',
  scheduledDate: '',
  estimatedDuration: 60
})

const selectedExercises = ref([])

const totalDuration = computed(() => {
  return selectedExercises.value.reduce((sum, exercise) => sum + exercise.duration, 0)
})

const filteredAvailableExercises = computed(() => {
  let exercises = exerciseStore.exercises.filter(
    exercise => !selectedExercises.value.some(selected => selected.id === exercise.id)
  )

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    exercises = exercises.filter(exercise =>
      exercise.title.toLowerCase().includes(query) ||
      exercise.description.toLowerCase().includes(query)
    )
  }

  if (filterPhase.value) {
    exercises = exercises.filter(exercise => exercise.phase === filterPhase.value)
  }

  if (filterDifficulty.value) {
    exercises = exercises.filter(exercise => exercise.difficulty === filterDifficulty.value)
  }

  return exercises
})

const getPhaseInfo = (phase) => PHASES[phase] || { label: phase, color: 'bg-gray-500', textColor: 'text-gray-600' }
const getDifficultyInfo = (difficulty) => DIFFICULTIES[difficulty] || { label: difficulty, color: 'bg-gray-500', textColor: 'text-gray-600' }

const addExercise = (exercise) => {
  selectedExercises.value.push(exercise)
}

const removeExercise = (index) => {
  selectedExercises.value.splice(index, 1)
}

const moveExercise = (fromIndex, toIndex) => {
  const exercise = selectedExercises.value.splice(fromIndex, 1)[0]
  selectedExercises.value.splice(toIndex, 0, exercise)
}

const saveSession = async () => {
  loading.value = true
  
  try {
    const sessionData = {
      ...form.value,
      exercises: selectedExercises.value.map(exercise => ({
        exerciseId: exercise.id
      }))
    }

    if (isEdit.value) {
      await sessionStore.updateSession(route.params.id, sessionData)
    } else {
      await sessionStore.createSession(sessionData)
    }
    
    router.push('/sessions')
  } catch (error) {
    console.error('Error saving session:', error)
    alert('Erreur lors de la sauvegarde de la session')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // Load exercises
  await exerciseStore.fetchExercises()

  // Set default date to tomorrow
  if (!isEdit.value) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(18, 0, 0, 0) // Default to 6 PM
    form.value.scheduledDate = tomorrow.toISOString().slice(0, 16)
  }

  // Load existing session if editing
  if (isEdit.value) {
    try {
      const session = await sessionStore.fetchSession(route.params.id)
      form.value = {
        title: session.title,
        description: session.description || '',
        scheduledDate: new Date(session.scheduledDate).toISOString().slice(0, 16),
        estimatedDuration: session.estimatedDuration
      }
      
      selectedExercises.value = session.exercises.map(se => se.exercise)
    } catch (error) {
      console.error('Error loading session:', error)
      router.push('/sessions')
    }
  }
})
</script>