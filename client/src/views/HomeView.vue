<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header simple -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          TrainPing
        </h1>
        <p class="text-gray-600">
          Tableau de bord
        </p>
      </div>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Exercices</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalExercises || 0 }}</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-lg">
              <RectangleStackIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Sessions</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.totalSessions || 0 }}</p>
            </div>
            <div class="bg-green-100 p-3 rounded-lg">
              <CalendarIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Terminées</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.completedSessions || 0 }}</p>
            </div>
            <div class="bg-purple-100 p-3 rounded-lg">
              <CheckCircleIcon class="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">À venir</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.upcomingSessions || 0 }}</p>
            </div>
            <div class="bg-orange-100 p-3 rounded-lg">
              <ClockIcon class="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Actions rapides -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <router-link to="/exercises/new" class="block">
          <div class="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="bg-blue-100 p-3 rounded-lg">
                <PlusIcon class="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Nouvel exercice</h3>
            <p class="text-gray-600 text-sm">Créer un exercice d'entraînement</p>
          </div>
        </router-link>

        <router-link to="/sessions/new" class="block">
          <div class="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="bg-green-100 p-3 rounded-lg">
                <CalendarIcon class="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Nouvelle session</h3>
            <p class="text-gray-600 text-sm">Organiser une session</p>
          </div>
        </router-link>

        <button class="text-left">
          <div class="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="bg-orange-100 p-3 rounded-lg">
                <PlayIcon class="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Entraînement</h3>
            <p class="text-gray-600 text-sm">Démarrer maintenant</p>
          </div>
        </button>
      </div>

      <!-- Sessions à venir -->
      <div class="bg-white rounded-lg shadow border p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Prochaines sessions</h2>
        
        <div v-if="upcomingSessions.length === 0" class="text-center py-8">
          <CalendarIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900">Aucune session programmée</h3>
          <p class="text-gray-600 mt-2">Créez votre première session</p>
          <router-link 
            to="/sessions/new" 
            class="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            Créer une session
          </router-link>
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="session in upcomingSessions.slice(0, 3)" 
            :key="session.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <h3 class="font-medium text-gray-900">{{ session.title }}</h3>
              <p class="text-sm text-gray-600">{{ formatDate(session.scheduledDate) }}</p>
            </div>
            <router-link 
              :to="`/training/${session.id}`" 
              class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Démarrer
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useSessionStore } from '../stores/sessions'
import { api } from '../api/client'
import { formatDate } from '../utils/constants'
import {
  RectangleStackIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  PlayIcon
} from '@heroicons/vue/24/outline'

const sessionStore = useSessionStore()
const stats = ref({})

const upcomingSessions = computed(() => sessionStore.upcomingSessions)

const fetchStats = async () => {
  try {
    const response = await api.stats.getAll()
    stats.value = response.data
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

onMounted(async () => {
  await Promise.all([
    fetchStats(),
    sessionStore.fetchSessions()
  ])
})
</script>