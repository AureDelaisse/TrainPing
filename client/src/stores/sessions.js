import { defineStore } from 'pinia'
import { api } from '../api/client'

export const useSessionStore = defineStore('sessions', {
  state: () => ({
    sessions: [],
    currentSession: null,
    loading: false,
    error: null,
    filters: {
      status: null,
      startDate: null,
      endDate: null
    }
  }),

  getters: {
    upcomingSessions: (state) => {
      const now = new Date()
      return state.sessions
        .filter(s => s.status === 'PLANNED' && new Date(s.scheduledDate) >= now)
        .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
    },
    
    pastSessions: (state) => {
      const now = new Date()
      return state.sessions
        .filter(s => s.status === 'COMPLETED' || new Date(s.scheduledDate) < now)
        .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate))
    },
    
    inProgressSessions: (state) => {
      return state.sessions.filter(s => s.status === 'IN_PROGRESS')
    }
  },

  actions: {
    async fetchSessions() {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.sessions.getAll(this.filters)
        this.sessions = response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Erreur lors du chargement des sessions'
        console.error('Error fetching sessions:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchSession(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.sessions.getOne(id)
        this.currentSession = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Erreur lors du chargement de la session'
        console.error('Error fetching session:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createSession(data) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.sessions.create(data)
        this.sessions.unshift(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Erreur lors de la création de la session'
        console.error('Error creating session:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateSession(id, data) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.sessions.update(id, data)
        const index = this.sessions.findIndex(s => s.id === id)
        if (index !== -1) {
          this.sessions[index] = response.data
        }
        if (this.currentSession?.id === id) {
          this.currentSession = response.data
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Erreur lors de la mise à jour de la session'
        console.error('Error updating session:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteSession(id) {
      this.loading = true
      this.error = null
      
      try {
        await api.sessions.delete(id)
        this.sessions = this.sessions.filter(s => s.id !== id)
        if (this.currentSession?.id === id) {
          this.currentSession = null
        }
      } catch (error) {
        this.error = error.response?.data?.error || 'Erreur lors de la suppression de la session'
        console.error('Error deleting session:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async duplicateSession(id, data) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.sessions.duplicate(id, data)
        this.sessions.unshift(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Erreur lors de la duplication de la session'
        console.error('Error duplicating session:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    clearFilters() {
      this.filters = {
        status: null,
        startDate: null,
        endDate: null
      }
    }
  }
})