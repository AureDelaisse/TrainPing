<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isEdit ? 'Modifier l\'exercice' : 'Nouvel exercice' }}
        </h1>
        <p class="mt-1 text-sm text-gray-600">
          {{ isEdit ? 'Modifiez les détails de l\'exercice' : 'Créez un nouvel exercice d\'entraînement' }}
        </p>
      </div>
      <router-link to="/exercises" class="btn-secondary">
        Retour
      </router-link>
    </div>

    <!-- Form -->
    <form @submit.prevent="saveExercise" class="space-y-6">
      <!-- Basic Info -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Informations de base</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Title -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
            <input
              v-model="form.title"
              type="text"
              required
              placeholder="Ex: Échauffement - Échanges réguliers"
              class="input"
            />
          </div>

          <!-- Description -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              v-model="form.description"
              rows="3"
              required
              placeholder="Décrivez l'exercice et ses objectifs..."
              class="input"
            ></textarea>
          </div>

          <!-- Phase -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Phase *</label>
            <select v-model="form.phase" required class="input">
              <option value="">Sélectionner une phase</option>
              <option v-for="phase in Object.values(PHASES)" :key="phase.value" :value="phase.value">
                {{ phase.label }}
              </option>
            </select>
          </div>

          <!-- Difficulty -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Difficulté *</label>
            <select v-model="form.difficulty" required class="input">
              <option value="">Sélectionner une difficulté</option>
              <option v-for="difficulty in Object.values(DIFFICULTIES)" :key="difficulty.value" :value="difficulty.value">
                {{ difficulty.label }}
              </option>
            </select>
          </div>

          <!-- Duration -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Durée (secondes) *</label>
            <input
              v-model.number="form.duration"
              type="number"
              min="30"
              max="1800"
              required
              placeholder="300"
              class="input"
            />
            <p class="text-xs text-gray-500 mt-1">{{ formatDuration(form.duration) }}</p>
          </div>

          <!-- Repetitions -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Répétitions *</label>
            <input
              v-model.number="form.repetitions"
              type="number"
              min="1"
              max="10"
              required
              placeholder="1"
              class="input"
            />
          </div>
        </div>
      </div>

      <!-- Visual Editor Placeholder -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Éditeur visuel</h3>
        <div class="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div class="space-y-3">
            <div class="w-16 h-16 bg-table-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg class="w-8 h-8 text-table-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 class="text-lg font-medium text-gray-900">Éditeur visuel Konva.js</h4>
            <p class="text-gray-600">L'éditeur pour dessiner les trajectoires sera implémenté ici</p>
            <p class="text-sm text-gray-500">Fonctionnalité à venir dans la prochaine version</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-4">
        <router-link to="/exercises" class="btn-secondary">
          Annuler
        </router-link>
        <button
          type="submit"
          :disabled="loading"
          class="btn-primary"
        >
          <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          {{ isEdit ? 'Mettre à jour' : 'Créer l\'exercice' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExerciseStore } from '../stores/exercises'
import { PHASES, DIFFICULTIES, formatDuration } from '../utils/constants'

const route = useRoute()
const router = useRouter()
const exerciseStore = useExerciseStore()

const loading = ref(false)
const isEdit = computed(() => !!route.params.id)

const form = ref({
  title: '',
  description: '',
  phase: '',
  difficulty: '',
  duration: 300,
  repetitions: 1,
  shots: []
})

const saveExercise = async () => {
  loading.value = true
  
  try {
    if (isEdit.value) {
      await exerciseStore.updateExercise(route.params.id, form.value)
    } else {
      await exerciseStore.createExercise(form.value)
    }
    
    router.push('/exercises')
  } catch (error) {
    console.error('Error saving exercise:', error)
    alert('Erreur lors de la sauvegarde de l\'exercice')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (isEdit.value) {
    try {
      const exercise = await exerciseStore.fetchExercise(route.params.id)
      form.value = {
        title: exercise.title,
        description: exercise.description,
        phase: exercise.phase,
        difficulty: exercise.difficulty,
        duration: exercise.duration,
        repetitions: exercise.repetitions,
        shots: exercise.shots || []
      }
    } catch (error) {
      console.error('Error loading exercise:', error)
      router.push('/exercises')
    }
  }
})
</script>