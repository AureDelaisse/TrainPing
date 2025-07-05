# Guide des Bonnes Pratiques de Développement

## 🎯 Philosophie du Développement

### Principes Fondamentaux

1. **Code Lisible** : Un code qui se lit comme une histoire
2. **Simplicité** : La solution la plus simple qui fonctionne
3. **Cohérence** : Même style dans tout le projet
4. **Performance** : Optimisation sans sacrifice de la lisibilité
5. **Sécurité** : Protection par défaut
6. **Testabilité** : Code facile à tester

### Analogie : Le Code comme une Recette de Cuisine

```javascript
// ❌ Recette illisible
const cook = (i) => i.map(x => x.temp > 100 ? {...x, done: true} : x)

// ✅ Recette claire
const cookIngredients = (ingredients) => {
  return ingredients.map(ingredient => {
    if (ingredient.temperature > BOILING_POINT) {
      return { ...ingredient, isCooked: true }
    }
    return ingredient
  })
}
```

---

## 📝 Conventions de Nommage

### Vue.js / Frontend

#### Composants
```javascript
// ✅ PascalCase pour les composants
ExerciseCard.vue
SessionManager.vue
TrainingTimer.vue

// ✅ Nom descriptif du rôle
UserProfileForm.vue      // ✅ Bon
Form.vue                 // ❌ Trop générique

// ✅ Composants de base avec préfixe
BaseButton.vue
BaseInput.vue
BaseModal.vue

// ✅ Composants métier avec contexte
ExerciseCreationForm.vue
SessionStatistics.vue
```

#### Variables et Fonctions
```javascript
// ✅ camelCase pour variables et fonctions
const exerciseCount = ref(0)
const isLoading = ref(false)
const selectedExercise = ref(null)

// ✅ Booléens avec préfixes
const isVisible = ref(true)
const hasError = ref(false)
const canEdit = ref(false)
const shouldUpdate = ref(true)

// ✅ Fonctions avec verbes d'action
const createExercise = () => {}
const updateSession = () => {}
const validateForm = () => {}
const handleSubmit = () => {}

// ✅ Event handlers avec préfixe
const handleExerciseClick = () => {}
const handleFormSubmit = () => {}
const onExerciseUpdate = () => {}
```

#### Props et Events
```javascript
// ✅ Props descriptives
defineProps({
  exercise: Object,           // Objet principal
  isEditable: Boolean,        // État/capacité
  showDetails: Boolean,       // Affichage
  maxDuration: Number,        // Limite/contrainte
  onSave: Function           // Callback
})

// ✅ Events avec préfixes
defineEmits([
  'update:exercise',          // Mise à jour
  'exercise-created',         // Action accomplie
  'exercise-selected',        // Sélection
  'validation-failed'         // État d'erreur
])
```

### Node.js / Backend

#### Fichiers et Dossiers
```
backend/
├── controllers/
│   ├── exerciseController.js    // ✅ camelCase + Controller
│   └── sessionController.js
├── routes/
│   ├── exercises.js             // ✅ Pluriel pour collections
│   └── sessions.js
├── models/
│   ├── Exercise.js              // ✅ PascalCase + Singulier
│   └── Session.js
├── services/
│   ├── exerciseService.js       // ✅ camelCase + Service
│   └── emailService.js
├── middleware/
│   ├── auth.js                  // ✅ Nom fonctionnel
│   ├── validation.js
│   └── errorHandler.js
└── utils/
    ├── logger.js                // ✅ Nom d'outil
    ├── crypto.js
    └── dateHelpers.js
```

#### Variables et Fonctions
```javascript
// ✅ Constantes en UPPER_SNAKE_CASE
const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET
const MAX_FILE_SIZE = 10 * 1024 * 1024

// ✅ Fonctions async avec préfixe
const getAllExercises = async () => {}
const createExercise = async () => {}
const findExerciseById = async () => {}

// ✅ Middleware descriptif
const authenticateUser = (req, res, next) => {}
const validateExerciseData = (req, res, next) => {}
const logRequestDuration = (req, res, next) => {}
```

---

## 🏗️ Architecture et Structure

### Organisation des Composants Vue

#### Structure Recommandée
```
src/
├── components/
│   ├── base/                    # Composants de base réutilisables
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   └── BaseModal.vue
│   ├── layout/                  # Composants de mise en page
│   │   ├── AppHeader.vue
│   │   ├── AppSidebar.vue
│   │   └── AppFooter.vue
│   ├── exercises/               # Composants métier par domaine
│   │   ├── ExerciseCard.vue
│   │   ├── ExerciseForm.vue
│   │   ├── ExerciseList.vue
│   │   └── canvas/
│   │       ├── TableCanvas.vue
│   │       └── TrajectoryEditor.vue
│   ├── sessions/
│   │   ├── SessionCard.vue
│   │   ├── SessionPlanner.vue
│   │   └── SessionTimer.vue
│   └── ui/                      # Composants UI génériques
│       ├── LoadingSpinner.vue
│       ├── ErrorMessage.vue
│       └── ConfirmDialog.vue
├── views/                       # Pages principales
├── stores/                      # Stores Pinia
├── composables/                 # Logique réutilisable
├── utils/                       # Utilitaires
└── api/                        # Services API
```

#### Anatomie d'un Composant Vue
```vue
<template>
  <!-- 
    Template organisé logiquement :
    1. Structure principale
    2. Contenu conditionnel
    3. Loading/Error states
  -->
  <div class="exercise-card">
    <!-- Header -->
    <header class="exercise-card__header">
      <h3 class="exercise-card__title">{{ exercise.title }}</h3>
      <ExerciseBadge :difficulty="exercise.difficulty" />
    </header>
    
    <!-- Content -->
    <main class="exercise-card__content">
      <p class="exercise-card__description">{{ exercise.description }}</p>
      
      <!-- Conditional content -->
      <div v-if="showDetails" class="exercise-card__details">
        <ExerciseStats :exercise="exercise" />
      </div>
    </main>
    
    <!-- Actions -->
    <footer class="exercise-card__actions">
      <BaseButton 
        variant="primary" 
        @click="handleStart"
        :disabled="isLoading"
      >
        Démarrer
      </BaseButton>
    </footer>
    
    <!-- Loading overlay -->
    <LoadingSpinner v-if="isLoading" overlay />
  </div>
</template>

<script setup>
// 1. Imports organisés
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ExerciseBadge from './ExerciseBadge.vue'
import ExerciseStats from './ExerciseStats.vue'
import BaseButton from '../base/BaseButton.vue'
import LoadingSpinner from '../ui/LoadingSpinner.vue'
import { useExerciseStore } from '@/stores/exercises'

// 2. Props avec validation
const props = defineProps({
  exercise: {
    type: Object,
    required: true,
    validator: (exercise) => {
      return exercise.id && exercise.title && exercise.difficulty
    }
  },
  showDetails: {
    type: Boolean,
    default: false
  }
})

// 3. Events
const emit = defineEmits(['start', 'edit', 'delete'])

// 4. Composables
const router = useRouter()
const exerciseStore = useExerciseStore()

// 5. État local
const isLoading = ref(false)
const error = ref(null)

// 6. Computed
const exerciseDuration = computed(() => {
  return `${Math.floor(props.exercise.duration / 60)}min ${props.exercise.duration % 60}s`
})

// 7. Méthodes
const handleStart = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    await exerciseStore.startExercise(props.exercise.id)
    emit('start', props.exercise)
    router.push(`/training/${props.exercise.id}`)
  } catch (err) {
    error.value = err.message
    console.error('Erreur démarrage exercice:', err)
  } finally {
    isLoading.value = false
  }
}

// 8. Watchers
watch(() => props.exercise.id, (newId) => {
  console.log('Exercise changed:', newId)
})

// 9. Lifecycle
onMounted(() => {
  console.log('ExerciseCard mounted:', props.exercise.title)
})
</script>

<style scoped>
/* 
  BEM CSS methodology 
  Block__Element--Modifier
*/
.exercise-card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.exercise-card:hover {
  @apply shadow-md;
  transform: translateY(-2px);
}

.exercise-card__header {
  @apply p-4 border-b border-gray-100;
}

.exercise-card__title {
  @apply text-lg font-semibold text-gray-900 mb-2;
}

.exercise-card__content {
  @apply p-4;
}

.exercise-card__description {
  @apply text-gray-600 text-sm mb-4;
}

.exercise-card__details {
  @apply pt-4 border-t border-gray-100;
}

.exercise-card__actions {
  @apply p-4 bg-gray-50 border-t border-gray-100;
}

/* Responsive design */
@media (max-width: 768px) {
  .exercise-card {
    @apply mx-2;
  }
  
  .exercise-card__title {
    @apply text-base;
  }
}
</style>
```

### Architecture Backend

#### Structure MVC Adaptée
```
backend/
├── src/
│   ├── app.js                  # Configuration Express
│   ├── server.js               # Point d'entrée
│   ├── routes/
│   │   ├── index.js            # Router principal
│   │   ├── exercises.js        # Routes exercices
│   │   └── sessions.js         # Routes sessions
│   ├── controllers/
│   │   ├── baseController.js   # Classe de base
│   │   ├── exerciseController.js
│   │   └── sessionController.js
│   ├── services/
│   │   ├── exerciseService.js  # Logique métier
│   │   ├── sessionService.js
│   │   └── validationService.js
│   ├── models/
│   │   ├── index.js            # Export des modèles
│   │   ├── Exercise.js
│   │   └── Session.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── utils/
│   │   ├── logger.js
│   │   ├── crypto.js
│   │   ├── validators.js
│   │   └── constants.js
│   └── config/
│       ├── database.js
│       ├── redis.js
│       └── environment.js
├── tests/
├── docs/
└── scripts/
```

#### Contrôleur Type
```javascript
// controllers/baseController.js
export class BaseController {
  constructor(service) {
    this.service = service
  }
  
  // Wrapper pour la gestion d'erreurs
  asyncHandler = (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next)
    }
  }
  
  // Réponse standardisée
  sendResponse(res, data, message = 'Success', statusCode = 200) {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    })
  }
  
  sendError(res, message, statusCode = 500, details = null) {
    res.status(statusCode).json({
      success: false,
      error: {
        message,
        statusCode,
        details,
        timestamp: new Date().toISOString()
      }
    })
  }
}

// controllers/exerciseController.js
import { BaseController } from './baseController.js'
import { exerciseService } from '../services/exerciseService.js'
import { validationService } from '../services/validationService.js'

class ExerciseController extends BaseController {
  constructor() {
    super(exerciseService)
  }
  
  // GET /api/exercises
  getAll = this.asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, ...filters } = req.query
    
    // Validation des paramètres
    const validatedFilters = validationService.validateExerciseFilters(filters)
    
    const result = await this.service.getAll({
      ...validatedFilters,
      page: parseInt(page),
      limit: parseInt(limit)
    })
    
    this.sendResponse(res, result, 'Exercices récupérés avec succès')
  })
  
  // GET /api/exercises/:id
  getById = this.asyncHandler(async (req, res) => {
    const { id } = req.params
    
    const exercise = await this.service.getById(id)
    
    if (!exercise) {
      return this.sendError(res, 'Exercice non trouvé', 404)
    }
    
    this.sendResponse(res, { exercise }, 'Exercice récupéré avec succès')
  })
  
  // POST /api/exercises
  create = this.asyncHandler(async (req, res) => {
    // Les données sont déjà validées par le middleware
    const exerciseData = req.body
    
    const exercise = await this.service.create(exerciseData)
    
    this.sendResponse(res, { exercise }, 'Exercice créé avec succès', 201)
  })
  
  // PUT /api/exercises/:id
  update = this.asyncHandler(async (req, res) => {
    const { id } = req.params
    const updates = req.body
    
    const exercise = await this.service.update(id, updates)
    
    if (!exercise) {
      return this.sendError(res, 'Exercice non trouvé', 404)
    }
    
    this.sendResponse(res, { exercise }, 'Exercice mis à jour avec succès')
  })
  
  // DELETE /api/exercises/:id
  delete = this.asyncHandler(async (req, res) => {
    const { id } = req.params
    
    const deleted = await this.service.delete(id)
    
    if (!deleted) {
      return this.sendError(res, 'Exercice non trouvé', 404)
    }
    
    this.sendResponse(res, null, 'Exercice supprimé avec succès', 204)
  })
}

export const exerciseController = new ExerciseController()
```

---

## 🧪 Tests et Qualité

### Tests Frontend (Vue.js)

#### Test d'un Composant
```javascript
// tests/components/ExerciseCard.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import ExerciseCard from '@/components/exercises/ExerciseCard.vue'

describe('ExerciseCard', () => {
  let wrapper
  let pinia
  
  const mockExercise = {
    id: '1',
    title: 'Service lifté',
    description: 'Exercice de service avec effet lifté',
    difficulty: 'INTERMEDIATE',
    duration: 300,
    phase: 'WARM_UP'
  }
  
  beforeEach(() => {
    pinia = createPinia()
    wrapper = mount(ExerciseCard, {
      props: {
        exercise: mockExercise
      },
      global: {
        plugins: [pinia]
      }
    })
  })
  
  it('devrait afficher le titre de l\'exercice', () => {
    expect(wrapper.find('.exercise-card__title').text()).toBe('Service lifté')
  })
  
  it('devrait afficher la description', () => {
    expect(wrapper.find('.exercise-card__description').text())
      .toBe('Exercice de service avec effet lifté')
  })
  
  it('devrait émettre un événement start au clic', async () => {
    await wrapper.find('button').trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('start')
    expect(wrapper.emitted().start[0]).toEqual([mockExercise])
  })
  
  it('devrait afficher un état de chargement', async () => {
    await wrapper.setData({ isLoading: true })
    
    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
    expect(wrapper.find('button').attributes()).toHaveProperty('disabled')
  })
  
  it('devrait gérer les erreurs', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Simuler une erreur
    wrapper.vm.exerciseStore.startExercise = vi.fn().mockRejectedValue(
      new Error('Erreur réseau')
    )
    
    await wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Erreur démarrage exercice:',
      expect.any(Error)
    )
    
    consoleSpy.mockRestore()
  })
})
```

#### Test d'un Composable
```javascript
// tests/composables/useExerciseFilters.test.js
import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useExerciseFilters } from '@/composables/useExerciseFilters'

describe('useExerciseFilters', () => {
  const mockExercises = ref([
    { id: '1', title: 'Service', difficulty: 'BEGINNER', phase: 'WARM_UP' },
    { id: '2', title: 'Smash', difficulty: 'ADVANCED', phase: 'MATCH_SITUATION' },
    { id: '3', title: 'Drive', difficulty: 'BEGINNER', phase: 'REGULARITY' }
  ])
  
  it('devrait filtrer par recherche textuelle', () => {
    const { searchTerm, filteredExercises } = useExerciseFilters(mockExercises)
    
    searchTerm.value = 'service'
    
    expect(filteredExercises.value).toHaveLength(1)
    expect(filteredExercises.value[0].title).toBe('Service')
  })
  
  it('devrait filtrer par difficulté', () => {
    const { selectedDifficulty, filteredExercises } = useExerciseFilters(mockExercises)
    
    selectedDifficulty.value = 'BEGINNER'
    
    expect(filteredExercises.value).toHaveLength(2)
    expect(filteredExercises.value.every(ex => ex.difficulty === 'BEGINNER')).toBe(true)
  })
  
  it('devrait combiner plusieurs filtres', () => {
    const { 
      searchTerm, 
      selectedDifficulty, 
      filteredExercises 
    } = useExerciseFilters(mockExercises)
    
    searchTerm.value = 'drive'
    selectedDifficulty.value = 'BEGINNER'
    
    expect(filteredExercises.value).toHaveLength(1)
    expect(filteredExercises.value[0].title).toBe('Drive')
  })
})
```

### Tests Backend (Node.js)

#### Test d'un Contrôleur
```javascript
// tests/controllers/exerciseController.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Exercise Controller', () => {
  beforeEach(async () => {
    // Nettoyer la base de test
    await prisma.exercise.deleteMany()
  })
  
  afterEach(async () => {
    await prisma.exercise.deleteMany()
  })
  
  describe('GET /api/exercises', () => {
    it('devrait retourner une liste vide initialement', async () => {
      const response = await request(app)
        .get('/api/exercises')
        .expect(200)
      
      expect(response.body.success).toBe(true)
      expect(response.body.data.exercises).toEqual([])
    })
    
    it('devrait retourner les exercices avec pagination', async () => {
      // Créer des exercices de test
      await prisma.exercise.createMany({
        data: [
          { title: 'Exercise 1', phase: 'WARM_UP', duration: 300, difficulty: 'BEGINNER' },
          { title: 'Exercise 2', phase: 'REGULARITY', duration: 600, difficulty: 'INTERMEDIATE' }
        ]
      })
      
      const response = await request(app)
        .get('/api/exercises?limit=1')
        .expect(200)
      
      expect(response.body.data.exercises).toHaveLength(1)
      expect(response.body.data.pagination.total).toBe(2)
    })
    
    it('devrait filtrer par difficulté', async () => {
      await prisma.exercise.createMany({
        data: [
          { title: 'Easy', phase: 'WARM_UP', duration: 300, difficulty: 'BEGINNER' },
          { title: 'Hard', phase: 'WARM_UP', duration: 300, difficulty: 'ADVANCED' }
        ]
      })
      
      const response = await request(app)
        .get('/api/exercises?difficulty=BEGINNER')
        .expect(200)
      
      expect(response.body.data.exercises).toHaveLength(1)
      expect(response.body.data.exercises[0].title).toBe('Easy')
    })
  })
  
  describe('POST /api/exercises', () => {
    it('devrait créer un nouvel exercice', async () => {
      const exerciseData = {
        title: 'Test Exercise',
        description: 'Test description',
        phase: 'WARM_UP',
        duration: 300,
        difficulty: 'BEGINNER',
        shots: []
      }
      
      const response = await request(app)
        .post('/api/exercises')
        .send(exerciseData)
        .expect(201)
      
      expect(response.body.success).toBe(true)
      expect(response.body.data.exercise.title).toBe(exerciseData.title)
      expect(response.body.data.exercise.id).toBeDefined()
    })
    
    it('devrait rejeter des données invalides', async () => {
      const invalidData = {
        title: 'AB', // Trop court
        phase: 'INVALID_PHASE',
        duration: -100 // Négatif
      }
      
      const response = await request(app)
        .post('/api/exercises')
        .send(invalidData)
        .expect(400)
      
      expect(response.body.success).toBe(false)
      expect(response.body.error.message).toContain('validation')
    })
  })
  
  describe('PUT /api/exercises/:id', () => {
    it('devrait mettre à jour un exercice existant', async () => {
      // Créer un exercice
      const exercise = await prisma.exercise.create({
        data: {
          title: 'Original Title',
          phase: 'WARM_UP',
          duration: 300,
          difficulty: 'BEGINNER'
        }
      })
      
      const updates = { title: 'Updated Title' }
      
      const response = await request(app)
        .put(`/api/exercises/${exercise.id}`)
        .send(updates)
        .expect(200)
      
      expect(response.body.data.exercise.title).toBe('Updated Title')
    })
    
    it('devrait retourner 404 pour un exercice inexistant', async () => {
      const response = await request(app)
        .put('/api/exercises/nonexistent-id')
        .send({ title: 'Updated' })
        .expect(404)
      
      expect(response.body.success).toBe(false)
    })
  })
})
```

#### Test d'un Service
```javascript
// tests/services/exerciseService.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { exerciseService } from '../src/services/exerciseService.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('ExerciseService', () => {
  beforeEach(async () => {
    await prisma.exercise.deleteMany()
  })
  
  afterEach(async () => {
    await prisma.exercise.deleteMany()
  })
  
  describe('create', () => {
    it('devrait créer un exercice avec des données valides', async () => {
      const exerciseData = {
        title: 'Test Exercise',
        description: 'Test description',
        phase: 'WARM_UP',
        duration: 300,
        difficulty: 'BEGINNER',
        shots: []
      }
      
      const exercise = await exerciseService.create(exerciseData)
      
      expect(exercise.id).toBeDefined()
      expect(exercise.title).toBe(exerciseData.title)
      expect(exercise.createdAt).toBeInstanceOf(Date)
    })
    
    it('devrait valider les données d\'entrée', async () => {
      const invalidData = {
        title: '', // Vide
        duration: -100 // Négatif
      }
      
      await expect(exerciseService.create(invalidData))
        .rejects
        .toThrow('validation')
    })
  })
  
  describe('getAll', () => {
    it('devrait appliquer les filtres correctement', async () => {
      await prisma.exercise.createMany({
        data: [
          { title: 'Exercise 1', phase: 'WARM_UP', duration: 300, difficulty: 'BEGINNER' },
          { title: 'Exercise 2', phase: 'REGULARITY', duration: 600, difficulty: 'ADVANCED' }
        ]
      })
      
      const result = await exerciseService.getAll({ difficulty: 'BEGINNER' })
      
      expect(result.exercises).toHaveLength(1)
      expect(result.exercises[0].difficulty).toBe('BEGINNER')
    })
    
    it('devrait paginer les résultats', async () => {
      // Créer 25 exercices
      const exercises = Array.from({ length: 25 }, (_, i) => ({
        title: `Exercise ${i + 1}`,
        phase: 'WARM_UP',
        duration: 300,
        difficulty: 'BEGINNER'
      }))
      
      await prisma.exercise.createMany({ data: exercises })
      
      const result = await exerciseService.getAll({ page: 2, limit: 10 })
      
      expect(result.exercises).toHaveLength(10)
      expect(result.pagination.currentPage).toBe(2)
      expect(result.pagination.totalPages).toBe(3)
    })
  })
})
```

---

## 🔒 Sécurité

### Validation et Sanitisation

#### Frontend (Vue.js)
```javascript
// utils/validation.js
export class ValidationError extends Error {
  constructor(message, field) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
  }
}

export const validators = {
  required: (value, message = 'Ce champ est requis') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      throw new ValidationError(message)
    }
    return true
  },
  
  minLength: (value, min, message = `Minimum ${min} caractères`) => {
    if (value && value.length < min) {
      throw new ValidationError(message)
    }
    return true
  },
  
  maxLength: (value, max, message = `Maximum ${max} caractères`) => {
    if (value && value.length > max) {
      throw new ValidationError(message)
    }
    return true
  },
  
  pattern: (value, regex, message = 'Format invalide') => {
    if (value && !regex.test(value)) {
      throw new ValidationError(message)
    }
    return true
  },
  
  email: (value, message = 'Email invalide') => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return validators.pattern(value, emailRegex, message)
  },
  
  numeric: (value, message = 'Doit être un nombre') => {
    if (value !== undefined && value !== null && isNaN(Number(value))) {
      throw new ValidationError(message)
    }
    return true
  },
  
  range: (value, min, max, message = `Doit être entre ${min} et ${max}`) => {
    const num = Number(value)
    if (!isNaN(num) && (num < min || num > max)) {
      throw new ValidationError(message)
    }
    return true
  }
}

// Composable de validation
export function useValidation() {
  const validateField = (value, rules) => {
    const errors = []
    
    for (const rule of rules) {
      try {
        if (typeof rule === 'function') {
          rule(value)
        } else if (typeof rule === 'object') {
          const { validator, ...params } = rule
          validator(value, ...Object.values(params))
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push(error.message)
        }
      }
    }
    
    return errors
  }
  
  const validateForm = (formData, validationRules) => {
    const errors = {}
    
    for (const [field, rules] of Object.entries(validationRules)) {
      const fieldErrors = validateField(formData[field], rules)
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors[0] // Premier erreur seulement
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
  
  return {
    validateField,
    validateForm,
    validators
  }
}

// Utilisation
const { validateForm, validators } = useValidation()

const validationRules = {
  title: [
    validators.required,
    (value) => validators.minLength(value, 3),
    (value) => validators.maxLength(value, 100),
    (value) => validators.pattern(value, /^[a-zA-Z0-9\s\-_àâäçéèêëïîôùûüÿ]+$/, 'Caractères non autorisés')
  ],
  email: [
    validators.required,
    validators.email
  ],
  duration: [
    validators.required,
    validators.numeric,
    (value) => validators.range(value, 30, 3600)
  ]
}

const { isValid, errors } = validateForm(formData, validationRules)
```

#### Backend (Node.js)
```javascript
// middleware/validation.js
import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

// Schémas de validation avec Zod
const exerciseSchema = z.object({
  title: z.string()
    .min(3, 'Le titre doit faire au moins 3 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-Z0-9\s\-_àâäçéèêëïîôùûüÿ]+$/, 'Caractères non autorisés'),
  
  description: z.string()
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .optional(),
  
  phase: z.enum(['WARM_UP', 'REGULARITY', 'UNCERTAINTY', 'MATCH_SITUATION']),
  
  duration: z.number()
    .min(30, 'Durée minimum 30 secondes')
    .max(3600, 'Durée maximum 1 heure'),
  
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  
  repetitions: z.number()
    .min(1, 'Minimum 1 répétition')
    .max(100, 'Maximum 100 répétitions')
    .default(1),
  
  shots: z.array(z.object({
    startPosition: z.object({
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1)
    }),
    endPosition: z.object({
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1)
    }),
    type: z.enum(['SERVE', 'DRIVE', 'TOPSPIN', 'BACKSPIN', 'SIDESPIN', 'SMASH', 'PUSH', 'BLOCK']),
    spin: z.enum(['NONE', 'TOPSPIN', 'BACKSPIN', 'SIDESPIN']),
    speed: z.enum(['SLOW', 'MEDIUM', 'FAST']),
    playerSide: z.enum(['PLAYER', 'OPPONENT'])
  })).default([])
})

// Middleware de validation
export const validateExercise = (req, res, next) => {
  try {
    // Sanitiser les données avant validation
    req.body = sanitizeInput(req.body)
    
    // Valider avec Zod
    const validatedData = exerciseSchema.parse(req.body)
    
    // Remplacer par les données validées
    req.body = validatedData
    
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Données invalides',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            received: err.received
          }))
        }
      })
    }
    
    next(error)
  }
}

// Sanitisation des entrées
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    // Nettoyer les caractères dangereux
    return DOMPurify.sanitize(input.trim(), { 
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    })
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput)
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized = {}
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value)
    }
    return sanitized
  }
  
  return input
}

// Rate limiting spécifique
export const createExerciseRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Maximum 10 créations par IP par fenêtre
  message: {
    success: false,
    error: {
      message: 'Trop de créations d\'exercices, veuillez patienter'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
})
```

### Protection CSRF et XSS

```javascript
// middleware/security.js
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

// Configuration Helmet pour la sécurité
export const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "ws:", "wss:"], // WebSockets
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
})

// Protection contre les attaques par force brute
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives par IP
  skipSuccessfulRequests: true,
  message: {
    error: 'Trop de tentatives de connexion'
  }
})

// Middleware anti-CSRF
export const csrfProtection = (req, res, next) => {
  // Vérifier l'origine pour les requêtes mutantes
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const origin = req.get('Origin')
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173']
    
    if (!origin || !allowedOrigins.includes(origin)) {
      return res.status(403).json({
        error: 'Origine non autorisée'
      })
    }
  }
  
  next()
}
```

---

## ⚡ Performance

### Optimisations Frontend

#### Lazy Loading et Code Splitting
```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Lazy loading avec noms de chunks
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue')
  },
  {
    path: '/exercises',
    name: 'exercises',
    component: () => import(/* webpackChunkName: "exercises" */ '../views/ExercisesView.vue')
  },
  {
    path: '/training/:id',
    name: 'training',
    component: () => import(/* webpackChunkName: "training" */ '../views/TrainingView.vue')
  }
]

// Preload des routes importantes
router.beforeEach((to, from, next) => {
  // Preload la route training si on est sur exercises
  if (to.name === 'exercises') {
    import('../views/TrainingView.vue')
  }
  next()
})
```

#### Optimisation des Images
```vue
<template>
  <!-- Image responsive avec lazy loading -->
  <picture>
    <source 
      media="(min-width: 768px)" 
      :srcset="`${exercise.image}?w=400&format=webp`"
      type="image/webp"
    >
    <source 
      media="(min-width: 768px)" 
      :srcset="`${exercise.image}?w=400&format=jpeg`"
      type="image/jpeg"
    >
    <img 
      :src="`${exercise.image}?w=200&format=jpeg`"
      :alt="exercise.title"
      loading="lazy"
      class="exercise-image"
      @load="handleImageLoad"
      @error="handleImageError"
    >
  </picture>
</template>

<script setup>
// Intersection Observer pour lazy loading avancé
const { ref: elementRef, inView } = useIntersectionObserver()

const shouldLoad = computed(() => inView.value || isPreloaded.value)
</script>
```

### Optimisations Backend

#### Cache Redis
```javascript
// services/cacheService.js
import Redis from 'ioredis'

class CacheService {
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL)
  }
  
  async get(key) {
    try {
      const cached = await this.redis.get(key)
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }
  
  async set(key, value, ttl = 300) {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value))
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }
  
  async del(pattern) {
    try {
      const keys = await this.redis.keys(pattern)
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  }
}

export const cacheService = new CacheService()

// Middleware de cache
export const cacheMiddleware = (ttl = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.method}:${req.originalUrl}`
    
    try {
      const cached = await cacheService.get(key)
      
      if (cached) {
        console.log('Cache hit:', key)
        return res.json(cached)
      }
      
      // Intercepter la réponse pour la mettre en cache
      const originalJson = res.json
      res.json = function(data) {
        cacheService.set(key, data, ttl)
        return originalJson.call(this, data)
      }
      
      next()
    } catch (error) {
      console.error('Cache middleware error:', error)
      next()
    }
  }
}
```

#### Optimisation des Requêtes Base de Données
```javascript
// services/exerciseService.js
class ExerciseService {
  async getAll(filters = {}) {
    const {
      page = 1,
      limit = 20,
      phase,
      difficulty,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters
    
    // Construire la requête Prisma optimisée
    const where = {}
    
    if (phase) where.phase = phase
    if (difficulty) where.difficulty = difficulty
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Exécuter les requêtes en parallèle
    const [exercises, total] = await Promise.all([
      prisma.exercise.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        // Optimisation : sélectionner seulement les champs nécessaires
        select: {
          id: true,
          title: true,
          description: true,
          phase: true,
          difficulty: true,
          duration: true,
          repetitions: true,
          createdAt: true,
          // Exclure le champ shots qui peut être volumineux
          shots: false
        }
      }),
      
      prisma.exercise.count({ where })
    ])
    
    return {
      exercises,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    }
  }
  
  async getById(id) {
    // Cache au niveau service
    const cacheKey = `exercise:${id}`
    let exercise = await cacheService.get(cacheKey)
    
    if (!exercise) {
      exercise = await prisma.exercise.findUnique({
        where: { id },
        // Inclure tous les champs pour la vue détaillée
        include: {
          sessions: {
            select: {
              id: true,
              title: true,
              scheduledDate: true
            }
          }
        }
      })
      
      if (exercise) {
        await cacheService.set(cacheKey, exercise, 600) // 10 minutes
      }
    }
    
    return exercise
  }
}
```

---

## 📝 Documentation et Commentaires

### Documentation du Code

#### JSDoc pour JavaScript
```javascript
/**
 * Service de gestion des exercices de tennis de table
 * @class ExerciseService
 */
class ExerciseService {
  /**
   * Récupère tous les exercices avec filtres et pagination
   * @param {Object} filters - Filtres à appliquer
   * @param {number} [filters.page=1] - Numéro de page
   * @param {number} [filters.limit=20] - Nombre d'éléments par page
   * @param {string} [filters.phase] - Phase d'entraînement
   * @param {string} [filters.difficulty] - Niveau de difficulté
   * @param {string} [filters.search] - Terme de recherche
   * @returns {Promise<{exercises: Array, pagination: Object}>} Liste paginée des exercices
   * @throws {Error} Erreur si la récupération échoue
   * 
   * @example
   * const result = await exerciseService.getAll({
   *   page: 1,
   *   limit: 10,
   *   difficulty: 'BEGINNER'
   * })
   * console.log(result.exercises) // [Exercise, Exercise, ...]
   */
  async getAll(filters = {}) {
    // Implémentation...
  }
  
  /**
   * Crée un nouvel exercice
   * @param {Object} exerciseData - Données de l'exercice
   * @param {string} exerciseData.title - Titre de l'exercice (3-100 caractères)
   * @param {string} [exerciseData.description] - Description optionnelle
   * @param {string} exerciseData.phase - Phase d'entraînement
   * @param {number} exerciseData.duration - Durée en secondes (30-3600)
   * @param {string} exerciseData.difficulty - Niveau de difficulté
   * @param {Array} [exerciseData.shots=[]] - Liste des coups
   * @returns {Promise<Object>} L'exercice créé
   * @throws {ValidationError} Si les données sont invalides
   */
  async create(exerciseData) {
    // Implémentation...
  }
}
```

#### Commentaires Vue.js
```vue
<template>
  <!-- 
    Composant de carte d'exercice
    
    Affiche les informations principales d'un exercice avec :
    - Titre et description
    - Badge de difficulté
    - Durée formatée
    - Actions (démarrer, éditer, supprimer)
    
    @example
    <ExerciseCard 
      :exercise="exercise" 
      :editable="true"
      @start="handleStart" 
    />
  -->
  <div class="exercise-card">
    <!-- Header avec titre et badge de difficulté -->
    <header class="exercise-card__header">
      <!-- ... -->
    </header>
    
    <!-- Contenu principal -->
    <main class="exercise-card__content">
      <!-- ... -->
    </main>
    
    <!-- Actions utilisateur -->
    <footer class="exercise-card__actions">
      <!-- ... -->
    </footer>
  </div>
</template>

<script setup>
/**
 * Composant de carte d'exercice
 * 
 * Composant réutilisable pour afficher un exercice dans une liste ou grille.
 * Gère les actions utilisateur et les états de chargement.
 * 
 * @component
 * @example
 * <ExerciseCard 
 *   :exercise="exercise" 
 *   :show-actions="true"
 *   @start="handleExerciseStart"
 *   @edit="handleExerciseEdit"
 * />
 */

/**
 * Props du composant
 * @typedef {Object} Props
 * @property {Object} exercise - L'exercice à afficher
 * @property {boolean} [showActions=true] - Afficher les boutons d'action
 * @property {boolean} [editable=false] - L'exercice peut être modifié
 */
const props = defineProps({
  exercise: {
    type: Object,
    required: true,
    validator: (exercise) => {
      return exercise.id && exercise.title && exercise.difficulty
    }
  },
  showActions: {
    type: Boolean,
    default: true
  },
  editable: {
    type: Boolean,
    default: false
  }
})

/**
 * Events émis par le composant
 * @typedef {Object} Events
 * @property {Function} start - Émis quand l'utilisateur démarre l'exercice
 * @property {Function} edit - Émis quand l'utilisateur veut éditer
 * @property {Function} delete - Émis quand l'utilisateur veut supprimer
 */
const emit = defineEmits(['start', 'edit', 'delete'])

// État local du composant
const isLoading = ref(false)
const error = ref(null)

/**
 * Démarre l'exercice
 * Gère l'état de chargement et les erreurs
 * @async
 * @function
 */
const handleStart = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    emit('start', props.exercise)
  } catch (err) {
    error.value = err.message
    console.error('Erreur démarrage exercice:', err)
  } finally {
    isLoading.value = false
  }
}
</script>
```

### README et Documentation Projet

```markdown
# TrainPing - Application de Gestion d'Entraînements Tennis de Table

## 📋 Description

TrainPing est une application web moderne permettant aux entraîneurs de tennis de table de créer, planifier et gérer leurs entraînements de manière interactive.

## 🚀 Fonctionnalités

- ✏️ **Création d'exercices visuellement** avec éditeur canvas interactif
- 📅 **Planification de sessions** d'entraînement personnalisées  
- ⏱️ **Mode entraînement** avec timer et suivi en temps réel
- 📊 **Statistiques** et historique des performances
- 🎨 **Interface moderne** responsive et accessible

## 🛠️ Technologies

### Frontend
- **Vue.js 3** - Framework réactif avec Composition API
- **Vite** - Build tool moderne et rapide
- **Tailwind CSS** - Framework CSS utility-first
- **Konva.js** - Canvas 2D pour l'éditeur visuel
- **Pinia** - Gestion d'état centralisée

### Backend  
- **Node.js** - Runtime JavaScript côté serveur
- **Express.js** - Framework web minimaliste
- **Prisma** - ORM moderne avec type safety
- **SQLite** - Base de données légère pour le développement

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/tennis-table-app.git
cd tennis-table-app
```

2. **Installer les dépendances backend**
```bash
cd server
npm install
cp .env.example .env
npx prisma db push
npx prisma db seed
```

3. **Installer les dépendances frontend**
```bash
cd ../client
npm install
```

4. **Démarrer l'application**
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
cd client && npm run dev
```

L'application sera accessible sur http://localhost:5173

## 📚 Documentation

- [Guide d'installation détaillé](docs/05-Guides/Installation.md)
- [Architecture du projet](docs/01-Architecture/Vue-Ensemble.md)
- [Guide Vue.js pour débutants](docs/03-Frontend/Introduction-Vue3.md)
- [API Documentation](docs/02-Backend/API-Routes.md)

## 🧪 Tests

```bash
# Tests frontend
cd client && npm run test

# Tests backend
cd server && npm run test

# Coverage
npm run test:coverage
```

## 🚀 Déploiement

```bash
# Build production
cd client && npm run build
cd ../server && npm run build

# Démarrer en production
npm start
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- 📖 [Documentation complète](docs/)
- 🐛 [Signaler un bug](https://github.com/votre-username/tennis-table-app/issues)
- 💬 [Discussions](https://github.com/votre-username/tennis-table-app/discussions)
```

---

## 🎯 Checklist des Bonnes Pratiques

### ✅ Code Quality
- [ ] Nommage cohérent et descriptif
- [ ] Fonctions courtes et spécialisées  
- [ ] Commentaires utiles et à jour
- [ ] Pas de code mort ou commenté
- [ ] Variables bien typées

### ✅ Architecture
- [ ] Séparation des responsabilités
- [ ] Composants réutilisables
- [ ] Services modulaires
- [ ] Configuration externalisée

### ✅ Performance  
- [ ] Lazy loading des routes
- [ ] Optimisation des images
- [ ] Cache approprié
- [ ] Requêtes DB optimisées
- [ ] Bundle size raisonnable

### ✅ Sécurité
- [ ] Validation côté client ET serveur
- [ ] Sanitisation des entrées
- [ ] Protection CSRF/XSS
- [ ] Rate limiting
- [ ] Headers de sécurité

### ✅ Tests
- [ ] Tests unitaires des composants
- [ ] Tests d'intégration API
- [ ] Tests de validation
- [ ] Coverage > 80%

### ✅ Documentation
- [ ] README complet
- [ ] Commentaires JSDoc
- [ ] Guide d'installation
- [ ] Exemples d'utilisation

Ces bonnes pratiques garantissent un code maintenable, sécurisé et performant ! 🚀

#best-practices #guidelines #code-quality #security #performance #testing #documentation