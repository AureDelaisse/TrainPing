<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header de page -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Sessions d'entraînement</h1>
            <p class="text-gray-600 mt-1">Gérez et lancez vos sessions d'entraînement</p>
          </div>
          <router-link 
            to="/sessions/new" 
            class="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            Nouvelle session
          </router-link>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="max-w-7xl mx-auto px-4 py-8">

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow border p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select 
              v-model="filters.status" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              @change="applyFilters"
            >
              <option value="">Tous les statuts</option>
              <option v-for="status in Object.values(SESSION_STATUS)" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
          </div>

          <!-- Date range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
            <input
              v-model="filters.startDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @change="applyFilters"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
            <input
              v-model="filters.endDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @change="applyFilters"
            />
          </div>

          <!-- Clear filters -->
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
      <div v-if="sessionStore.loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-sm text-gray-500">Chargement...</p>
      </div>

      <!-- Error -->
      <div v-else-if="sessionStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-600">{{ sessionStore.error }}</p>
      </div>

      <!-- Sessions -->
      <div v-else-if="sessionStore.sessions.length > 0" class="space-y-10">
        <!-- Sessions planifiées -->
        <section v-if="upcomingSessions.length > 0">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Sessions planifiées</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SessionCard
              v-for="session in upcomingSessions"
              :key="session.id"
              :session="session"
              @start="startTraining"
              @edit="editSession"
              @duplicate="duplicateSession"
              @delete="deleteSession"
            />
          </div>
        </section>

        <!-- Sessions en cours -->
        <section v-if="inProgressSessions.length > 0">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">En cours</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SessionCard
              v-for="session in inProgressSessions"
              :key="session.id"
              :session="session"
              @continue="continueTraining"
              @edit="editSession"
              @duplicate="duplicateSession"
              @delete="deleteSession"
            />
          </div>
        </section>

        <!-- Sessions passées -->
        <section v-if="pastSessions.length > 0">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Sessions passées</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SessionCard
              v-for="session in pastSessions.slice(0, 6)"
              :key="session.id"
              :session="session"
              @view="viewSession"
              @edit="editSession"
              @duplicate="duplicateSession"
              @delete="deleteSession"
            />
          </div>
          <div v-if="pastSessions.length > 6" class="text-center mt-6">
            <button @click="showAllPast = !showAllPast" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
              {{ showAllPast ? 'Voir moins' : `Voir ${pastSessions.length - 6} sessions de plus` }}
            </button>
          </div>
        </section>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <CalendarIcon class="h-12 w-12 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune session planifiée</h3>
        <p class="text-gray-500 mb-6">
          {{ Object.values(filters).some(v => v) ? 
             'Aucune session ne correspond à vos critères de recherche.' : 
             'Commencez par créer votre première session d\'entraînement' }}
        </p>
        <router-link 
          to="/sessions/new" 
          class="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon class="h-5 w-5 mr-2" />
          Créer une session
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '../stores/sessions'
import { SESSION_STATUS } from '../utils/constants'
import SessionCard from '../components/sessions/SessionCard.vue'
import {
  PlusIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const sessionStore = useSessionStore()

const filters = ref({
  status: '',
  startDate: '',
  endDate: ''
})

const showAllPast = ref(false)

const upcomingSessions = computed(() => sessionStore.upcomingSessions)
const inProgressSessions = computed(() => sessionStore.inProgressSessions)
const pastSessions = computed(() => {
  const sessions = sessionStore.pastSessions
  return showAllPast.value ? sessions : sessions.slice(0, 6)
})

const applyFilters = () => {
  sessionStore.setFilters(filters.value)
  sessionStore.fetchSessions()
}

const clearFilters = () => {
  filters.value = {
    status: '',
    startDate: '',
    endDate: ''
  }
  sessionStore.clearFilters()
  sessionStore.fetchSessions()
}

const startTraining = (sessionId) => {
  router.push(`/training/${sessionId}`)
}

const continueTraining = (sessionId) => {
  router.push(`/training/${sessionId}`)
}

const viewSession = (sessionId) => {
  router.push(`/sessions/${sessionId}`)
}

const editSession = (sessionId) => {
  router.push(`/sessions/${sessionId}/edit`)
}

const duplicateSession = async (session) => {
  try {
    const newTitle = `${session.title} (copie)`
    const newDate = new Date()
    newDate.setDate(newDate.getDate() + 7) // Next week
    
    await sessionStore.duplicateSession(session.id, {
      title: newTitle,
      scheduledDate: newDate.toISOString()
    })
  } catch (error) {
    console.error('Error duplicating session:', error)
  }
}

const deleteSession = async (sessionId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette session ?')) {
    try {
      await sessionStore.deleteSession(sessionId)
    } catch (error) {
      console.error('Error deleting session:', error)
    }
  }
}

onMounted(() => {
  sessionStore.fetchSessions()
})
</script>