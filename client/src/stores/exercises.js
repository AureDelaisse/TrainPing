import { defineStore } from 'pinia'
import { api } from '../api/client'

export const useExerciseStore = defineStore('exercises', {
  state: () => ({
    exercises: [],
    currentExercise: null,
    loading: false,
    error: null,
    filters: {
      phase: null,
      difficulty: null,
      search: ''
    }
  }),

  getters: {
    filteredExercises: (state) => {
      let filtered = [...state.exercises]
      
      if (state.filters.phase) {
        filtered = filtered.filter(e => e.phase === state.filters.phase)
      }
      
      if (state.filters.difficulty) {
        filtered = filtered.filter(e => e.difficulty === state.filters.difficulty)
      }
      
      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        filtered = filtered.filter(e => 
          e.title.toLowerCase().includes(search) ||
          e.description.toLowerCase().includes(search)
        )
      }
      
      return filtered
    },
    
    exercisesByPhase: (state) => {
      const grouped = {}
      state.exercises.forEach(exercise => {
        if (!grouped[exercise.phase]) {
          grouped[exercise.phase] = []
        }
        grouped[exercise.phase].push(exercise)
      })
      return grouped
    }
  },

  actions: {
    async fetchExercises() {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.exercises.getAll(this.filters)
        this.exercises = response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Erreur lors du chargement des exercices'
        console.error('Error fetching exercises:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchExercise(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.exercises.getOne(id)
        this.currentExercise = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Erreur lors du chargement de l\'exercice'
        console.error('Error fetching exercise:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createExercise(data) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.exercises.create(data)
        this.exercises.unshift(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Erreur lors de la création de l\'exercice'
        console.error('Error creating exercise:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateExercise(id, data) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.exercises.update(id, data)
        const index = this.exercises.findIndex(e => e.id === id)
        if (index !== -1) {
          this.exercises[index] = response.data
        }
        if (this.currentExercise?.id === id) {
          this.currentExercise = response.data
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Erreur lors de la mise à jour de l\'exercice'
        console.error('Error updating exercise:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteExercise(id) {
      this.loading = true
      this.error = null
      
      try {
        await api.exercises.delete(id)
        this.exercises = this.exercises.filter(e => e.id !== id)
        if (this.currentExercise?.id === id) {
          this.currentExercise = null
        }
      } catch (error) {
        this.error = error.response?.data?.error || 'Erreur lors de la suppression de l\'exercice'
        console.error('Error deleting exercise:', error)
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
        phase: null,
        difficulty: null,
        search: ''
      }
    }
  }
})