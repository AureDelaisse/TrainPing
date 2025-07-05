<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Exercices</h1>
          <p class="mt-2 text-gray-600">{{ filteredExercises.length }} exercice(s) disponible(s)</p>
        </div>
        <router-link 
          to="/exercises/new" 
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon class="h-5 w-5 mr-2" />
          Nouvel exercice
        </router-link>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow border p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Nom de l'exercice..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @input="applyFilters"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Phase</label>
            <select 
              v-model="filters.phase" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              @change="applyFilters"
            >
              <option value="">Toutes les phases</option>
              <option value="WARM_UP">Échauffement</option>
              <option value="REGULARITY">Régularité</option>
              <option value="UNCERTAINTY">Incertitude</option>
              <option value="MATCH_SITUATION">Situation de match</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Difficulté</label>
            <select 
              v-model="filters.difficulty" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              @change="applyFilters"
            >
              <option value="">Toutes les difficultés</option>
              <option value="BEGINNER">Débutant</option>
              <option value="INTERMEDIATE">Intermédiaire</option>
              <option value="ADVANCED">Avancé</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>

          <div class="flex items-end">
            <button 
              @click="clearFilters" 
              class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      </div>

    <!-- Loading -->
    <div v-if="exerciseStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
      <p class="mt-2 text-sm text-gray-500">Chargement...</p>
    </div>

    <!-- Error -->
    <div v-else-if="exerciseStore.error" class="card p-4 border-red-200 bg-red-50">
      <p class="text-red-600">{{ exerciseStore.error }}</p>
    </div>

      <!-- Exercises Grid -->
      <div v-else-if="filteredExercises.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="exercise in filteredExercises"
          :key="exercise.id"
          class="bg-white rounded-lg shadow border p-6 hover:shadow-md transition-shadow"
        >
          <!-- Header -->
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ exercise.title }}</h3>
              <p class="text-sm text-gray-600 line-clamp-2">{{ exercise.description }}</p>
            </div>
            <div class="flex space-x-1 ml-4">
              <router-link
                :to="`/exercises/${exercise.id}/edit`"
                class="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded"
              >
                <PencilIcon class="h-4 w-4" />
              </router-link>
              <button
                @click="deleteExercise(exercise.id)"
                class="p-2 text-gray-400 hover:text-red-600 transition-colors rounded"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span :class="getPhaseBadge(exercise.phase)">
              {{ getPhaseLabel(exercise.phase) }}
            </span>
            <span :class="getDifficultyBadge(exercise.difficulty)">
              {{ getDifficultyLabel(exercise.difficulty) }}
            </span>
          </div>

          <!-- Stats -->
          <div class="flex justify-between text-sm text-gray-500">
            <span>{{ formatDuration(exercise.duration) }}</span>
            <span>{{ exercise.repetitions }} répétition{{ exercise.repetitions > 1 ? 's' : '' }}</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <PlayIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-4 text-lg font-medium text-gray-900">Aucun exercice trouvé</h3>
        <p class="mt-2 text-sm text-gray-500">
          {{ filters.search || filters.phase || filters.difficulty ? 
             'Aucun exercice ne correspond à vos critères.' : 
             'Commencez par créer votre premier exercice.' }}
        </p>
        <div class="mt-6">
          <router-link 
            to="/exercises/new" 
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            Créer un exercice
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useExerciseStore } from '../stores/exercises'
import { formatDuration } from '../utils/constants'
import {
  PlusIcon,
  PlayIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

const exerciseStore = useExerciseStore()

const filters = ref({
  search: '',
  phase: '',
  difficulty: ''
})

const filteredExercises = computed(() => exerciseStore.filteredExercises)

const getPhaseLabel = (phase) => {
  const phases = {
    'WARM_UP': 'Échauffement',
    'REGULARITY': 'Régularité',
    'UNCERTAINTY': 'Incertitude',
    'MATCH_SITUATION': 'Situation de match'
  }
  return phases[phase] || phase
}

const getDifficultyLabel = (difficulty) => {
  const difficulties = {
    'BEGINNER': 'Débutant',
    'INTERMEDIATE': 'Intermédiaire',
    'ADVANCED': 'Avancé',
    'EXPERT': 'Expert'
  }
  return difficulties[difficulty] || difficulty
}

const getPhaseBadge = (phase) => {
  const badges = {
    'WARM_UP': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
    'REGULARITY': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
    'UNCERTAINTY': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
    'MATCH_SITUATION': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'
  }
  return badges[phase] || 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
}

const getDifficultyBadge = (difficulty) => {
  const badges = {
    'BEGINNER': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
    'INTERMEDIATE': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
    'ADVANCED': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800',
    'EXPERT': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'
  }
  return badges[difficulty] || 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
}

const applyFilters = () => {
  exerciseStore.setFilters(filters.value)
  exerciseStore.fetchExercises()
}

const clearFilters = () => {
  filters.value = {
    search: '',
    phase: '',
    difficulty: ''
  }
  exerciseStore.clearFilters()
  exerciseStore.fetchExercises()
}

const deleteExercise = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet exercice ?')) {
    try {
      await exerciseStore.deleteExercise(id)
    } catch (error) {
      console.error('Error deleting exercise:', error)
    }
  }
}

onMounted(() => {
  exerciseStore.fetchExercises()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>