<template>
  <div class="space-y-6">
    <!-- Card infos de base -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations de base</h2>
      
      <div class="space-y-4">
        <!-- Titre -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Titre de l'exercice *
          </label>
          <input
            v-model="exercise.title"
            type="text"
            :class="[
              'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500',
              exercise.title ? 'border-green-500' : 'border-gray-300'
            ]"
            placeholder="Ex: Coup droit diagonal en régularité"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Objectif pédagogique
          </label>
          <textarea
            v-model="exercise.description"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Travailler la régularité et le placement du coup droit"
          />
        </div>

        <!-- Paramètres spécifiques régularité -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nombre de balles par série *
            </label>
            <input
              v-model.number="exercise.ballsPerSeries"
              type="number"
              min="10"
              max="100"
              step="10"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="30"
            />
            <p class="text-xs text-gray-500 mt-1">Recommandé: 20-50 balles</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nombre de séries *
            </label>
            <input
              v-model.number="exercise.seriesCount"
              type="number"
              min="1"
              max="10"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="3"
            />
            <p class="text-xs text-gray-500 mt-1">Recommandé: 2-5 séries</p>
          </div>
        </div>

        <!-- Difficulté -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Niveau de difficulté *
          </label>
          <select 
            v-model="exercise.difficulty" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choisir le niveau...</option>
            <option value="BEGINNER">🟢 Débutant</option>
            <option value="INTERMEDIATE">🟡 Intermédiaire</option>
            <option value="ADVANCED">🟠 Avancé</option>
            <option value="EXPERT">🔴 Expert</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Card schéma de jeu -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Schéma de régularité</h2>
      
      <!-- Choix du pattern -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Sélectionnez le schéma à répéter
        </label>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <!-- Patterns prédéfinis -->
          <button
            v-for="pattern in regularityPatterns"
            :key="pattern.id"
            @click="selectPattern(pattern)"
            :class="[
              'p-4 rounded-lg border-2 transition-all text-left',
              exercise.patternId === pattern.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center space-x-3">
              <div class="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                <!-- Icon selon le pattern -->
                <component :is="pattern.icon" class="w-8 h-8 text-gray-600" />
              </div>
              <div class="flex-1">
                <p class="font-medium text-sm text-gray-900">{{ pattern.name }}</p>
                <p class="text-xs text-gray-500">{{ pattern.description }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Personnalisation du pattern -->
      <div v-if="exercise.patternId" class="space-y-4 pt-4 border-t border-gray-200">
        <h3 class="text-sm font-medium text-gray-700">Détails du schéma</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Coup utilisé -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Coup utilisé</label>
            <select v-model="exercise.shotType" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="FOREHAND">Coup droit uniquement</option>
              <option value="BACKHAND">Revers uniquement</option>
              <option value="BOTH">Alternance CD/Revers</option>
            </select>
          </div>
          
          <!-- Vitesse de jeu -->
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Vitesse de jeu</label>
            <select v-model="exercise.speed" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="SLOW">🐢 Lent (débutant)</option>
              <option value="MEDIUM">🚶 Moyen</option>
              <option value="FAST">🏃 Rapide (confirmé)</option>
            </select>
          </div>
        </div>

        <!-- Aperçu visuel -->
        <div class="mt-4">
          <label class="block text-xs font-medium text-gray-600 mb-2">Aperçu du schéma</label>
          <div class="bg-gray-50 rounded-lg p-4">
            <RegularityPreview 
              :pattern="selectedPattern" 
              :settings="exercise" 
            />
          </div>
        </div>
      </div>

      <!-- Configuration pattern personnalisé -->
      <div v-if="exercise.patternId === 'custom'" class="space-y-4 pt-4 border-t border-gray-200">
        <h3 class="text-sm font-medium text-gray-700">Configuration du schéma personnalisé</h3>
        
        <!-- 1. Position fixe du distributeur -->
        <div class="bg-blue-50 rounded-lg p-4">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            📍 Position du distributeur (fixe)
          </label>
          
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="zone in ['BACKHAND', 'MIDDLE', 'FOREHAND']"
              :key="zone"
              @click="exercise.distributorPosition = zone"
              :class="[
                'py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all',
                exercise.distributorPosition === zone
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
              ]"
            >
              {{ getZoneLabel(zone) }}
            </button>
          </div>
          
          <p class="text-xs text-gray-600 mt-2">
            Le distributeur restera toujours à cette position
          </p>
        </div>

        <!-- 2. Séquence de distribution -->
        <div class="bg-orange-50 rounded-lg p-4">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            🎯 Séquence de distribution (celui qui se déplace)
          </label>
          
          <!-- Liste des positions dans la séquence -->
          <div class="space-y-2 mb-3">
            <div v-for="(position, index) in exercise.sequence" :key="index" 
                 class="flex items-center space-x-2">
              <span class="text-sm text-gray-500 w-6">{{ index + 1 }}.</span>
              
              <div class="flex-1 grid grid-cols-3 gap-1">
                <button
                  v-for="zone in ['BACKHAND', 'MIDDLE', 'FOREHAND']"
                  :key="zone"
                  @click="updateSequencePosition(index, zone)"
                  :class="[
                    'py-1 px-2 rounded text-xs font-medium transition-all',
                    position === zone
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-orange-50'
                  ]"
                >
                  {{ getZoneLabel(zone) }}
                </button>
              </div>
              
              <button
                @click="removeFromSequence(index)"
                class="text-red-500 hover:text-red-700 p-1"
                :disabled="exercise.sequence.length <= 1"
                title="Supprimer cette position"
              >
                <XMarkIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <!-- Bouton ajouter -->
          <button
            @click="addToSequence"
            class="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1"
          >
            <PlusIcon class="w-4 h-4" />
            <span>Ajouter une position</span>
          </button>
          
          <p class="text-xs text-gray-600 mt-3">
            La séquence se répétera en boucle. Actuellement : 
            <span class="font-medium">{{ getSequenceDescription() }}</span>
          </p>
        </div>

        <!-- 3. Aperçu visuel du schéma -->
        <div class="bg-gray-50 rounded-lg p-4">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            👁️ Aperçu du schéma personnalisé
          </label>
          
          <CustomPatternPreview
            :distributorPosition="exercise.distributorPosition"
            :sequence="exercise.sequence"
          />
          
          <!-- Exemple textuel -->
          <div class="mt-3 p-3 bg-white rounded border border-gray-200">
            <p class="text-xs text-gray-600">
              <strong>Fonctionnement :</strong> Le distributeur en {{ getZoneLabel(exercise.distributorPosition) }} 
              envoie la balle en {{ exercise.sequence.map(z => getZoneLabel(z)).join(' → ') }}.
              Le joueur qui se déplace renvoie toujours en {{ getZoneLabel(exercise.distributorPosition) }}.
            </p>
          </div>
        </div>

        <!-- 4. Temps au lieu de séries -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              ⏱️ Temps par joueur *
            </label>
            <div class="flex items-center space-x-2">
              <input
                v-model.number="exercise.timePerPlayer"
                type="number"
                min="1"
                max="10"
                step="0.5"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <span class="text-sm text-gray-600">minutes</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Temps pour un côté (sera doublé au total)
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              ⏱️ Temps total
            </label>
            <div class="px-3 py-2 bg-gray-100 rounded-lg">
              <span class="text-lg font-semibold text-gray-900">
                {{ exercise.timePerPlayer * 2 }} minutes
              </span>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Chaque joueur fait l'exercice
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Card points clés -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Points techniques</h2>
      
      <div class="space-y-3">
        <div v-for="(point, index) in exercise.keyPoints" :key="index" class="flex items-start space-x-2">
          <span class="text-blue-600 mt-0.5 font-bold">•</span>
          <input
            v-model="exercise.keyPoints[index]"
            type="text"
            class="flex-1 px-3 py-1 border border-gray-300 rounded"
            placeholder="Ex: Garder le coude proche du corps"
          />
          <button 
            @click="removeKeyPoint(index)" 
            class="text-red-500 hover:text-red-700 p-1"
            title="Supprimer ce point"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
        
        <button
          @click="addKeyPoint"
          class="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
        >
          <PlusIcon class="w-4 h-4" />
          <span>Ajouter un point technique</span>
        </button>
      </div>

      <!-- Points suggérés selon le pattern -->
      <div v-if="suggestedKeyPoints.length > 0" class="mt-4 pt-4 border-t border-gray-200">
        <p class="text-xs font-medium text-gray-600 mb-2">Points suggérés pour ce type d'exercice :</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="suggestion in suggestedKeyPoints"
            :key="suggestion"
            @click="addSuggestedPoint(suggestion)"
            class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            + {{ suggestion }}
          </button>
        </div>
      </div>
    </div>

    <!-- Résumé et durée estimée -->
    <div class="bg-blue-50 rounded-xl border border-blue-200 p-6">
      <h3 class="text-sm font-semibold text-blue-900 mb-2">Résumé de l'exercice</h3>
      <div class="text-sm text-blue-800 space-y-1">
        <!-- Résumé pour pattern personnalisé -->
        <template v-if="exercise.patternId === 'custom'">
          <p>• <strong>{{ exercise.timePerPlayer }} minutes</strong> par joueur, <strong>{{ exercise.timePerPlayer * 2 }} minutes</strong> au total</p>
          <p>• Distributeur : <strong>{{ getZoneLabel(exercise.distributorPosition) }}</strong></p>
          <p>• Séquence : <strong>{{ getSequenceDescription() }}</strong></p>
          <p>• Schéma : <strong>{{ selectedPattern?.name || 'Personnalisé' }}</strong></p>
        </template>
        
        <!-- Résumé pour patterns prédéfinis -->
        <template v-else>
          <p>• <strong>{{ exercise.ballsPerSeries || 0 }} balles</strong> par série, <strong>{{ exercise.seriesCount || 0 }} séries</strong> au total</p>
          <p>• <strong>{{ totalBalls }}</strong> balles au total</p>
          <p>• Durée estimée : <strong>{{ estimatedDuration }}</strong></p>
          <p v-if="selectedPattern">• Schéma : <strong>{{ selectedPattern.name }}</strong></p>
        </template>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end space-x-4 pt-4">
      <button
        @click="$emit('cancel')"
        class="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        Annuler
      </button>
      <button
        @click="save"
        :disabled="!isValid"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Créer l'exercice
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import RegularityPreview from './RegularityPreview.vue'
import CustomPatternPreview from './CustomPatternPreview.vue'
import {
  ArrowsRightLeftIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUturnRightIcon,
  EllipsisHorizontalCircleIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

const emit = defineEmits(['save', 'cancel'])

const exercise = ref({
  type: 'REGULARITY',
  title: '',
  description: '',
  ballsPerSeries: 30,
  seriesCount: 3,
  timePerPlayer: 2, // En minutes pour pattern personnalisé
  difficulty: '',
  patternId: null,
  shotType: 'FOREHAND',
  speed: 'MEDIUM',
  keyPoints: [''],
  
  // Pour pattern personnalisé
  distributorPosition: 'BACKHAND',
  sequence: ['BACKHAND', 'MIDDLE', 'BACKHAND', 'FOREHAND']
})

// Patterns prédéfinis pour régularité
const regularityPatterns = [
  {
    id: 'diagonal',
    name: 'Diagonale',
    description: 'CD sur CD ou R sur R',
    icon: ArrowTopRightOnSquareIcon
  },
  {
    id: 'parallel',
    name: 'Parallèle',
    description: 'CD sur R ou R sur CD',
    icon: ArrowsRightLeftIcon
  },
  {
    id: 'pivot',
    name: 'Pivot',
    description: 'Alterner CD et R du même côté',
    icon: ArrowUturnRightIcon
  },
  {
    id: 'middle',
    name: 'Axe central',
    description: 'Jouer dans l\'axe du corps',
    icon: EllipsisHorizontalCircleIcon
  },
  {
    id: 'custom',
    name: 'Personnalisé',
    description: 'Créer votre propre schéma',
    icon: PlusIcon
  }
]

const selectedPattern = computed(() => 
  regularityPatterns.find(p => p.id === exercise.value.patternId)
)

// Helper functions pour le pattern personnalisé
function getZoneLabel(zone) {
  const labels = {
    'BACKHAND': 'Revers',
    'MIDDLE': 'Milieu', 
    'FOREHAND': 'Coup droit'
  }
  return labels[zone] || zone
}

function updateSequencePosition(index, zone) {
  exercise.value.sequence[index] = zone
}

function addToSequence() {
  exercise.value.sequence.push('MIDDLE')
}

function removeFromSequence(index) {
  if (exercise.value.sequence.length > 1) {
    exercise.value.sequence.splice(index, 1)
  }
}

function getSequenceDescription() {
  const zones = exercise.value.sequence.map(z => getZoneLabel(z))
  return zones.join(' → ') + ' (et on recommence)'
}

const isValid = computed(() => {
  const basicValid = exercise.value.title && 
                    exercise.value.patternId && 
                    exercise.value.difficulty
  
  // Pour pattern personnalisé, vérifier les champs spécifiques
  if (exercise.value.patternId === 'custom') {
    return basicValid && 
           exercise.value.timePerPlayer > 0 &&
           exercise.value.distributorPosition &&
           exercise.value.sequence.length > 0
  }
  
  // Pour patterns prédéfinis, vérifier les champs classiques
  return basicValid && 
         exercise.value.ballsPerSeries && 
         exercise.value.seriesCount
})

const totalBalls = computed(() => {
  if (exercise.value.patternId === 'custom') {
    return 0 // Pas utilisé pour le pattern personnalisé
  }
  return (exercise.value.ballsPerSeries || 0) * (exercise.value.seriesCount || 0)
})

const estimatedDuration = computed(() => {
  if (exercise.value.patternId === 'custom') {
    // Pour pattern personnalisé : temps fixe
    return `${exercise.value.timePerPlayer * 2} min`
  }
  
  // Pour patterns prédéfinis : calcul basé sur les balles
  const balls = totalBalls.value
  const speedMultiplier = {
    'SLOW': 2.5,
    'MEDIUM': 2,
    'FAST': 1.5
  }[exercise.value.speed] || 2
  
  const minutes = Math.ceil((balls * speedMultiplier) / 60)
  return `${minutes} min`
})

// Points clés suggérés selon le pattern
const suggestedKeyPoints = computed(() => {
  const suggestions = {
    'diagonal': [
      'Garder les pieds parallèles à la trajectoire',
      'Transfert du poids du corps',
      'Contact de balle à l\'apex'
    ],
    'parallel': [
      'Rotation du bassin',
      'Placement du pied extérieur',
      'Finir le geste vers l\'avant'
    ],
    'pivot': [
      'Rester centré sur ses appuis',
      'Rotation rapide du tronc',
      'Garder l\'équilibre'
    ],
    'middle': [
      'Position neutre du corps',
      'Adaptation gauche/droite',
      'Anticipation de la balle'
    ],
    'custom': [
      'Communication entre distributeur et joueur',
      'Respiration régulière pendant l\'effort',
      'Adapter la vitesse selon le niveau',
      'Changer de rôle régulièrement'
    ]
  }
  
  return suggestions[exercise.value.patternId] || []
})

function selectPattern(pattern) {
  exercise.value.patternId = pattern.id
}

function addKeyPoint() {
  exercise.value.keyPoints.push('')
}

function removeKeyPoint(index) {
  exercise.value.keyPoints.splice(index, 1)
  if (exercise.value.keyPoints.length === 0) {
    exercise.value.keyPoints.push('')
  }
}

function addSuggestedPoint(suggestion) {
  // Éviter les doublons
  if (!exercise.value.keyPoints.includes(suggestion)) {
    // Remplacer le premier point vide ou ajouter à la fin
    const emptyIndex = exercise.value.keyPoints.findIndex(p => !p.trim())
    if (emptyIndex >= 0) {
      exercise.value.keyPoints[emptyIndex] = suggestion
    } else {
      exercise.value.keyPoints.push(suggestion)
    }
  }
}

function save() {
  // Nettoyer les points vides
  exercise.value.keyPoints = exercise.value.keyPoints.filter(p => p.trim())
  
  let exerciseData
  
  if (exercise.value.patternId === 'custom') {
    // Pattern personnalisé : utiliser le temps
    exerciseData = {
      ...exercise.value,
      duration: exercise.value.timePerPlayer * 2 * 60, // Convertir en secondes
      shots: generateCustomPatternShots()
    }
  } else {
    // Patterns prédéfinis : utiliser les balles
    const estimatedSeconds = Math.ceil(totalBalls.value * {
      'SLOW': 2.5,
      'MEDIUM': 2,
      'FAST': 1.5
    }[exercise.value.speed])
    
    exerciseData = {
      ...exercise.value,
      duration: estimatedSeconds,
      shots: generateShotsFromPattern()
    }
  }
  
  emit('save', exerciseData)
}

// Génération des shots pour compatibilité avec l'API existante
function generateShotsFromPattern() {
  if (!exercise.value.patternId) return []
  
  const patterns = {
    'diagonal': [
      { startPosition: { x: 0.2, y: 0.8 }, endPosition: { x: 0.8, y: 0.2 }, type: 'DRIVE', playerSide: 'PLAYER' },
      { startPosition: { x: 0.8, y: 0.2 }, endPosition: { x: 0.2, y: 0.8 }, type: 'DRIVE', playerSide: 'OPPONENT' }
    ],
    'parallel': [
      { startPosition: { x: 0.2, y: 0.8 }, endPosition: { x: 0.2, y: 0.2 }, type: 'DRIVE', playerSide: 'PLAYER' },
      { startPosition: { x: 0.2, y: 0.2 }, endPosition: { x: 0.2, y: 0.8 }, type: 'DRIVE', playerSide: 'OPPONENT' }
    ],
    'pivot': [
      { startPosition: { x: 0.5, y: 0.8 }, endPosition: { x: 0.2, y: 0.2 }, type: 'BACKHAND', playerSide: 'PLAYER' },
      { startPosition: { x: 0.2, y: 0.2 }, endPosition: { x: 0.8, y: 0.8 }, type: 'DRIVE', playerSide: 'OPPONENT' }
    ],
    'middle': [
      { startPosition: { x: 0.5, y: 0.8 }, endPosition: { x: 0.5, y: 0.2 }, type: 'DRIVE', playerSide: 'PLAYER' },
      { startPosition: { x: 0.5, y: 0.2 }, endPosition: { x: 0.5, y: 0.8 }, type: 'DRIVE', playerSide: 'OPPONENT' }
    ]
  }
  
  return patterns[exercise.value.patternId] || []
}

// Génération des shots pour pattern personnalisé
function generateCustomPatternShots() {
  const distributorPos = getZonePosition(exercise.value.distributorPosition)
  const shots = []
  
  // Créer une séquence de shots basée sur la configuration
  exercise.value.sequence.forEach((targetZone, index) => {
    const targetPos = getZonePosition(targetZone)
    
    // Shot du distributeur vers la cible
    shots.push({
      startPosition: distributorPos,
      endPosition: targetPos,
      type: 'DRIVE',
      playerSide: 'OPPONENT', // Le distributeur est considéré comme l'adversaire
      spin: 'NONE',
      speed: exercise.value.speed || 'MEDIUM'
    })
    
    // Shot de retour vers le distributeur
    shots.push({
      startPosition: targetPos,
      endPosition: distributorPos,
      type: exercise.value.shotType || 'DRIVE',
      playerSide: 'PLAYER', // Le joueur mobile
      spin: 'NONE',
      speed: exercise.value.speed || 'MEDIUM'
    })
  })
  
  return shots
}

// Helper pour convertir zone en position
function getZonePosition(zone) {
  const positions = {
    'BACKHAND': { x: 0.2, y: 0.5 },
    'MIDDLE': { x: 0.5, y: 0.5 },
    'FOREHAND': { x: 0.8, y: 0.5 }
  }
  return positions[zone] || positions['MIDDLE']
}
</script>