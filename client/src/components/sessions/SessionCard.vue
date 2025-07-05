<template>
  <div class="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden flex flex-col">
    <!-- Badge de statut -->
    <div v-if="session.status === 'PLANNED'" class="absolute top-4 right-4">
      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        Planifiée
      </span>
    </div>
    <div v-else-if="session.status === 'IN_PROGRESS'" class="absolute top-4 right-4">
      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        En cours
      </span>
    </div>
    <div v-else-if="session.status === 'COMPLETED'" class="absolute top-4 right-4">
      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
        Terminée
      </span>
    </div>

    <!-- Contenu principal -->
    <div class="p-6 flex-1">
      <!-- Titre et description -->
      <div class="mb-4">
        <h3 class="text-xl font-semibold text-gray-900 mb-2 pr-24">
          {{ session.title }}
        </h3>
        <p v-if="session.description" class="text-gray-600">
          {{ session.description }}
        </p>
      </div>

      <!-- Métadonnées -->
      <div class="flex items-center space-x-6 text-sm text-gray-500 mb-6">
        <div class="flex items-center">
          <CalendarIcon class="w-4 h-4 mr-1.5" />
          <span>{{ formatDateTime(session.scheduledDate) }}</span>
        </div>
        <div class="flex items-center">
          <ClockIcon class="w-4 h-4 mr-1.5" />
          <span>{{ session.estimatedDuration }} min</span>
        </div>
        <div class="flex items-center">
          <RectangleStackIcon class="w-4 h-4 mr-1.5" />
          <span>{{ session.exercises?.length || 0 }} exercice(s)</span>
        </div>
      </div>
      <div v-if="session.status === 'IN_PROGRESS'" class="mb-6" >
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">Progression</span>
          <span class="font-medium text-gray-900">{{ session.progress || 0 }}%</span>
        </div>
        <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="`width: ${session.progress || 0}%`"
          ></div>
        </div>
      </div>
      <!-- Liste des exercices améliorée -->
      <div v-if="session.exercises?.length > 0" class="space-y-2 mb-6">
        <div class="text-sm font-medium text-gray-700 mb-2">Exercices inclus :</div>
        <div class="space-y-2">
          <div
            v-for="(exercise, index) in session.exercises.slice(0, 3)"
            :key="exercise.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-xs font-medium text-blue-600">{{ index + 1 }}</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ exercise.exercise?.title || exercise.title }}</p>
                <p class="text-xs text-gray-500">{{ exercise.exercise?.duration || exercise.duration }}s • {{ exercise.exercise?.phase || exercise.phase }}</p>
              </div>
            </div>
          </div>

          <!-- Afficher "+X autres" si plus de 3 exercices -->
          <div v-if="session.exercises.length > 3" class="text-sm text-gray-500 pl-11">
            +{{ session.exercises.length - 3 }} autre(s) exercice(s)
          </div>
        </div>
      </div>

    </div>

    <!-- Actions - Toujours en bas -->
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <button
            @click="$emit('edit', session.id)"
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <PencilIcon class="w-5 h-5" />
          </button>
          <button
            @click="$emit('duplicate', session)"
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <DocumentDuplicateIcon class="w-5 h-5" />
          </button>
          <button
            @click="$emit('delete', session.id)"
            class="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <TrashIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Bouton principal moderne -->
        <button 
          v-if="session.status === 'PLANNED'"
          @click="$emit('start', session.id)"
          class="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-sm"
        >
          <PlayIcon class="w-4 h-4 mr-2" />
          Démarrer
        </button>
        
        <button 
          v-else-if="session.status === 'IN_PROGRESS'"
          @click="$emit('continue', session.id)"
          class="relative inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-sm"
        >
          <span class="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
          <PlayIcon class="w-4 h-4 mr-2" />
          Continuer
        </button>
        
        <button 
          v-else-if="session.status === 'COMPLETED'"
          @click="$emit('view', session.id)"
          class="inline-flex items-center px-5 py-2.5 bg-white text-blue-600 font-medium rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all duration-200"
        >
          <EyeIcon class="w-4 h-4 mr-2" />
          Voir
        </button>
      </div>
    </div>

    <!-- Barre de progression pour sessions en cours -->

  </div>
</template>

<script setup>
import { SESSION_STATUS, formatDateTime } from '../../utils/constants'
import {
  CalendarIcon,
  ClockIcon,
  PlayIcon,
  EyeIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  RectangleStackIcon
} from '@heroicons/vue/24/outline'

defineProps({
  session: {
    type: Object,
    required: true
  }
})

defineEmits(['start', 'continue', 'view', 'edit', 'duplicate', 'delete'])
</script>

<style scoped>
/* Animation au survol pour les cartes */
.group:hover {
  transform: translateY(-2px);
}
</style>