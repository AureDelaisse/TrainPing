import { defineStore } from 'pinia'
import { api } from '../api/client'

export const useTrainingStore = defineStore('training', {
  state: () => ({
    activeSession: null,
    currentExerciseIndex: 0,
    isRunning: false,
    isPaused: false,
    exerciseStartTime: null,
    exerciseElapsedTime: 0,
    history: [],
    loading: false,
    error: null
  }),

  getters: {
    currentExercise: (state) => {
      if (!state.activeSession?.exercises) return null
      return state.activeSession.exercises[state.currentExerciseIndex]
    },
    
    totalExercises: (state) => {
      return state.activeSession?.exercises?.length || 0
    },
    
    progress: (state) => {
      if (!state.activeSession?.exercises?.length) return 0
      return Math.round((state.currentExerciseIndex / state.activeSession.exercises.length) * 100)
    },
    
    remainingExercises: (state) => {
      if (!state.activeSession?.exercises) return 0
      return state.activeSession.exercises.length - state.currentExerciseIndex
    }
  },

  actions: {
    async startTraining(sessionId) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.training.start(sessionId)
        this.activeSession = response.data
        this.currentExerciseIndex = 0
        this.isRunning = true
        this.isPaused = false
        this.exerciseStartTime = Date.now()
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Erreur lors du démarrage de l\'entraînement'
        console.error('Error starting training:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async completeCurrentExercise(notes = '') {
      if (!this.currentExercise) return
      
      this.loading = true
      this.error = null
      
      try {
        const response = await api.training.completeExercise(this.currentExercise.exercise.id, {
          sessionId: this.activeSession.id,
          notes
        })
        
        this.history.push(response.data)
        
        // Move to next exercise
        if (this.currentExerciseIndex < this.totalExercises - 1) {
          this.currentExerciseIndex++
          this.exerciseStartTime = Date.now()
          this.exerciseElapsedTime = 0
        } else {
          // Training completed
          await this.completeTraining()
        }
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Erreur lors de la validation de l\'exercice'
        console.error('Error completing exercise:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async completeTraining() {
      if (!this.activeSession) return
      
      this.loading = true
      this.error = null
      
      try {
        const response = await api.training.complete(this.activeSession.id)
        this.isRunning = false
        this.isPaused = false
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Erreur lors de la finalisation de l\'entraînement'
        console.error('Error completing training:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchHistory(sessionId) {
      this.loading = true
      this.error = null
      
      try {
        const response = await api.training.history(sessionId)
        this.history = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Erreur lors du chargement de l\'historique'
        console.error('Error fetching history:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    pauseTraining() {
      if (this.isRunning && !this.isPaused) {
        this.isPaused = true
        this.exerciseElapsedTime += Date.now() - this.exerciseStartTime
      }
    },

    resumeTraining() {
      if (this.isRunning && this.isPaused) {
        this.isPaused = false
        this.exerciseStartTime = Date.now()
      }
    },

    skipExercise() {
      if (this.currentExerciseIndex < this.totalExercises - 1) {
        this.currentExerciseIndex++
        this.exerciseStartTime = Date.now()
        this.exerciseElapsedTime = 0
      }
    },

    previousExercise() {
      if (this.currentExerciseIndex > 0) {
        this.currentExerciseIndex--
        this.exerciseStartTime = Date.now()
        this.exerciseElapsedTime = 0
      }
    },

    resetTraining() {
      this.activeSession = null
      this.currentExerciseIndex = 0
      this.isRunning = false
      this.isPaused = false
      this.exerciseStartTime = null
      this.exerciseElapsedTime = 0
      this.history = []
      this.error = null
    }
  }
})