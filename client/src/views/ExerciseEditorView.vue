<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Nouvel exercice</h1>
        <p class="text-gray-600 mt-2">Choisissez d'abord le type d'exercice à créer</p>
      </div>

      <!-- Si aucun type sélectionné -->
      <div v-if="!selectedType" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Card Régularité -->
        <button
          @click="selectType('REGULARITY')"
          class="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-left group"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ArrowPathIcon class="w-6 h-6 text-blue-600" />
            </div>
            <ArrowRightIcon class="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Régularité</h3>
          <p class="text-sm text-gray-600">
            Exercice avec schéma répétitif fixe. Les joueurs répètent toujours les mêmes coups.
          </p>
          <p class="text-xs text-gray-500 mt-2">
            Ex: Coup droit diagonal en continu
          </p>
        </button>

        <!-- Card Régularité + Jeu libre -->
        <button
          @click="selectType('REGULARITY_FREE')"
          class="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all text-left group"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <SparklesIcon class="w-6 h-6 text-green-600" />
            </div>
            <ArrowRightIcon class="w-5 h-5 text-gray-400 group-hover:text-green-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Régularité + Jeu libre</h3>
          <p class="text-sm text-gray-600">
            Schéma de base régulier, puis phase de jeu libre après X échanges.
          </p>
          <p class="text-xs text-gray-500 mt-2">
            Ex: 6 coups droits puis point libre
          </p>
        </button>

        <!-- Card Incertitude -->
        <button
          @click="selectType('UNCERTAINTY')"
          class="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all text-left group"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <QuestionMarkCircleIcon class="w-6 h-6 text-purple-600" />
            </div>
            <ArrowRightIcon class="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Incertitude</h3>
          <p class="text-sm text-gray-600">
            Le joueur doit s'adapter. Choix entre plusieurs options selon la situation.
          </p>
          <p class="text-xs text-gray-500 mt-2">
            Ex: Alterner revers/coup droit selon la balle
          </p>
        </button>

        <!-- Card Situation de match -->
        <button
          @click="selectType('MATCH_SITUATION')"
          class="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all text-left group"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrophyIcon class="w-6 h-6 text-orange-600" />
            </div>
            <ArrowRightIcon class="w-5 h-5 text-gray-400 group-hover:text-orange-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Situation de match</h3>
          <p class="text-sm text-gray-600">
            Simulation de points réels avec services, retours et stratégies.
          </p>
          <p class="text-xs text-gray-500 mt-2">
            Ex: Service court + attaque
          </p>
        </button>
      </div>

      <!-- Si type sélectionné : Formulaire spécifique -->
      <div v-else>
        <!-- Breadcrumb -->
        <div class="flex items-center space-x-2 text-sm mb-6">
          <button @click="selectedType = null" class="text-gray-500 hover:text-gray-700">
            Types d'exercices
          </button>
          <ChevronRightIcon class="w-4 h-4 text-gray-400" />
          <span class="text-gray-900 font-medium">{{ getTypeLabel(selectedType) }}</span>
        </div>

        <!-- Formulaire selon le type -->
        <RegularityForm 
          v-if="selectedType === 'REGULARITY'"
          @save="saveExercise"
          @cancel="selectedType = null"
        />
        
        <!-- Placeholder pour les autres types -->
        <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Cog6ToothIcon class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">En développement</h3>
          <p class="text-gray-600 mb-4">
            Ce type d'exercice sera disponible dans une prochaine version.
          </p>
          <button
            @click="selectedType = null"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour à la sélection
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useExerciseStore } from '../stores/exercises'
import RegularityForm from '../components/exercises/RegularityForm.vue'
import {
  ArrowPathIcon,
  SparklesIcon,
  QuestionMarkCircleIcon,
  TrophyIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const exerciseStore = useExerciseStore()

const selectedType = ref(null)

const exerciseTypes = {
  REGULARITY: {
    label: 'Régularité',
    color: 'blue'
  },
  REGULARITY_FREE: {
    label: 'Régularité + Jeu libre',
    color: 'green'
  },
  UNCERTAINTY: {
    label: 'Incertitude',
    color: 'purple'
  },
  MATCH_SITUATION: {
    label: 'Situation de match',
    color: 'orange'
  }
}

function selectType(type) {
  selectedType.value = type
}

function getTypeLabel(type) {
  return exerciseTypes[type]?.label || type
}

async function saveExercise(exerciseData) {
  try {
    // Ajouter le type sélectionné aux données
    const fullExerciseData = {
      ...exerciseData,
      type: selectedType.value,
      phase: selectedType.value // Pour compatibilité avec l'API existante
    }
    
    await exerciseStore.createExercise(fullExerciseData)
    
    // Redirection vers la liste des exercices
    router.push('/exercises')
  } catch (error) {
    console.error('Erreur lors de la création de l\'exercice:', error)
    alert('Erreur lors de la création de l\'exercice')
  }
}
</script>