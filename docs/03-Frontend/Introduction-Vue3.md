# Introduction à Vue.js 3

## 🎯 Qu'est-ce que Vue.js ?

Vue.js est un **framework JavaScript progressif** pour créer des interfaces utilisateur interactives. Pensez-y comme un système qui :

- 🔄 Met à jour automatiquement l'affichage quand les données changent
- 🧩 Organise votre code en composants réutilisables  
- 🚀 Gère la navigation entre pages sans rechargement
- 📱 Crée des applications web modernes et réactives

## 🆚 Vue.js vs JavaScript vanilla

### Avec JavaScript classique
```html
<!-- HTML -->
<div>
  <h1 id="title">Exercices</h1>
  <ul id="exercise-list"></ul>
  <button id="add-btn">Ajouter</button>
</div>

<script>
// JavaScript - Beaucoup de code manuel
const title = document.getElementById('title')
const list = document.getElementById('exercise-list')
const btn = document.getElementById('add-btn')

let exercises = []

function updateUI() {
  list.innerHTML = ''
  exercises.forEach(ex => {
    const li = document.createElement('li')
    li.textContent = ex.title
    list.appendChild(li)
  })
  title.textContent = `Exercices (${exercises.length})`
}

btn.addEventListener('click', () => {
  exercises.push({ title: 'Nouvel exercice' })
  updateUI() // ⚠️ Il faut penser à mettre à jour !
})
</script>
```

### Avec Vue.js 3
```vue
<template>
  <div>
    <h1>Exercices ({{ exercises.length }})</h1>
    <ul>
      <li v-for="exercise in exercises" :key="exercise.id">
        {{ exercise.title }}
      </li>
    </ul>
    <button @click="addExercise">Ajouter</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// ✅ Données réactives - Vue s'occupe des mises à jour !
const exercises = ref([])

const addExercise = () => {
  exercises.value.push({ 
    id: Date.now(),
    title: 'Nouvel exercice' 
  })
  // ✅ L'interface se met à jour automatiquement !
}
</script>
```

## 🔑 Concepts fondamentaux

### 1. Composants
Un composant Vue = un morceau d'interface réutilisable avec son propre état et logique.

```vue
<!-- ExerciseCard.vue -->
<template>
  <div class="exercise-card">
    <h3>{{ exercise.title }}</h3>
    <p>{{ exercise.description }}</p>
    <span class="badge">{{ exercise.difficulty }}</span>
    
    <button @click="startExercise">Démarrer</button>
  </div>
</template>

<script setup>
// Props = données reçues du composant parent
const props = defineProps({
  exercise: {
    type: Object,
    required: true
  }
})

// Events = messages envoyés au parent
const emit = defineEmits(['start'])

const startExercise = () => {
  emit('start', props.exercise.id)
}
</script>

<style scoped>
.exercise-card {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
}

.badge {
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}
</style>
```

### 2. Réactivité avec `ref` et `reactive`

Les données "réactives" se mettent à jour automatiquement dans l'interface :

```javascript
import { ref, reactive } from 'vue'

// ref() pour les valeurs primitives (string, number, boolean)
const count = ref(0)
const title = ref('Mon exercice')
const isLoading = ref(false)

// Pour lire/modifier la valeur
console.log(count.value) // 0
count.value++            // count devient 1
title.value = 'Nouveau titre'

// reactive() pour les objets
const exercise = reactive({
  title: 'Service lifté',
  duration: 300,
  difficulty: 'INTERMEDIATE'
})

// Accès direct aux propriétés
console.log(exercise.title) // 'Service lifté'
exercise.duration = 600     // Se met à jour automatiquement
```

### 3. Template et directives

Le template utilise une syntaxe HTML étendue :

```vue
<template>
  <!-- Affichage de données -->
  <h1>{{ exerciseTitle }}</h1>
  
  <!-- Attributs dynamiques -->
  <img :src="exerciseImage" :alt="exerciseTitle">
  
  <!-- Conditions -->
  <div v-if="isLoading">Chargement...</div>
  <div v-else-if="exercises.length === 0">Aucun exercice</div>
  <div v-else>{{ exercises.length }} exercices trouvés</div>
  
  <!-- Boucles -->
  <ul>
    <li v-for="exercise in exercises" :key="exercise.id">
      {{ exercise.title }}
    </li>
  </ul>
  
  <!-- Événements -->
  <button @click="createExercise">Créer</button>
  <input @keyup.enter="search" v-model="searchTerm">
  
  <!-- Classes et styles dynamiques -->
  <div :class="{ active: isActive, disabled: !isEnabled }">
  <div :style="{ color: textColor, fontSize: fontSize + 'px' }">
</template>
```

### 4. Computed (propriétés calculées)

Pour des valeurs dérivées qui se recalculent automatiquement :

```javascript
import { ref, computed } from 'vue'

const exercises = ref([
  { title: 'Service', difficulty: 'BEGINNER' },
  { title: 'Smash', difficulty: 'ADVANCED' },
  { title: 'Revers', difficulty: 'BEGINNER' }
])

// ✅ Se recalcule automatiquement quand exercises change
const beginnerExercises = computed(() => {
  return exercises.value.filter(ex => ex.difficulty === 'BEGINNER')
})

const exerciseStats = computed(() => {
  return {
    total: exercises.value.length,
    beginner: exercises.value.filter(ex => ex.difficulty === 'BEGINNER').length,
    advanced: exercises.value.filter(ex => ex.difficulty === 'ADVANCED').length
  }
})
```

### 5. Watchers (observateurs)

Pour réagir aux changements de données :

```javascript
import { ref, watch } from 'vue'

const searchTerm = ref('')
const exercises = ref([])

// Watcher simple
watch(searchTerm, (newValue, oldValue) => {
  console.log(`Recherche : "${oldValue}" → "${newValue}"`)
  searchExercises(newValue)
})

// Watcher avec options
watch(
  () => exercises.value.length,
  (newCount, oldCount) => {
    if (newCount > oldCount) {
      console.log('Nouvel exercice ajouté !')
    }
  },
  { immediate: true } // Exécute immédiatement
)
```

## 🔄 Cycle de vie d'un composant

```javascript
import { ref, onMounted, onUpdated, onUnmounted } from 'vue'

export default {
  setup() {
    const exercises = ref([])
    
    // 🟢 Composant créé et monté dans le DOM
    onMounted(async () => {
      console.log('Composant monté')
      exercises.value = await fetchExercises()
    })
    
    // 🔄 Composant mis à jour
    onUpdated(() => {
      console.log('Composant mis à jour')
    })
    
    // 🔴 Composant sur le point d'être détruit
    onUnmounted(() => {
      console.log('Nettoyage avant destruction')
      // Nettoyer les timers, événements, etc.
    })
    
    return { exercises }
  }
}
```

## 🔗 Communication entre composants

### Parent → Enfant (Props)
```vue
<!-- Parent.vue -->
<template>
  <ExerciseCard 
    :exercise="selectedExercise"
    :show-details="true"
    @start="handleStart"
  />
</template>

<!-- ExerciseCard.vue -->
<script setup>
const props = defineProps({
  exercise: Object,
  showDetails: Boolean
})

const emit = defineEmits(['start'])
</script>
```

### Enfant → Parent (Events)
```vue
<!-- ExerciseCard.vue -->
<template>
  <button @click="startExercise">Démarrer</button>
</template>

<script setup>
const emit = defineEmits(['start', 'edit', 'delete'])

const startExercise = () => {
  emit('start', { exerciseId: props.exercise.id, timestamp: Date.now() })
}
</script>
```

## 🛠️ Composition API vs Options API

Vue 3 introduit la **Composition API** plus moderne :

### Options API (ancienne)
```javascript
export default {
  data() {
    return {
      exercises: [],
      isLoading: false
    }
  },
  computed: {
    exerciseCount() {
      return this.exercises.length
    }
  },
  methods: {
    async fetchExercises() {
      this.isLoading = true
      this.exercises = await api.getExercises()
      this.isLoading = false
    }
  },
  mounted() {
    this.fetchExercises()
  }
}
```

### Composition API (moderne) ✅
```javascript
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const exercises = ref([])
    const isLoading = ref(false)
    
    const exerciseCount = computed(() => exercises.value.length)
    
    const fetchExercises = async () => {
      isLoading.value = true
      exercises.value = await api.getExercises()
      isLoading.value = false
    }
    
    onMounted(fetchExercises)
    
    return {
      exercises,
      isLoading,
      exerciseCount,
      fetchExercises
    }
  }
}
```

### Script Setup (encore plus moderne) ✅✅
```vue
<script setup>
import { ref, computed, onMounted } from 'vue'

const exercises = ref([])
const isLoading = ref(false)

const exerciseCount = computed(() => exercises.value.length)

const fetchExercises = async () => {
  isLoading.value = true
  exercises.value = await api.getExercises()
  isLoading.value = false
}

onMounted(fetchExercises)
// Pas besoin de return, tout est automatiquement exposé !
</script>
```

## 📝 Exemple concret : Page d'exercices

```vue
<template>
  <div class="exercises-page">
    <!-- Header -->
    <div class="page-header">
      <h1>Exercices ({{ filteredExercises.length }})</h1>
      <button @click="showCreateForm = true" class="btn-primary">
        Créer un exercice
      </button>
    </div>
    
    <!-- Filters -->
    <div class="filters">
      <input 
        v-model="searchTerm" 
        placeholder="Rechercher..."
        class="search-input"
      >
      <select v-model="selectedDifficulty">
        <option value="">Toutes difficultés</option>
        <option value="BEGINNER">Débutant</option>
        <option value="INTERMEDIATE">Intermédiaire</option>
        <option value="ADVANCED">Avancé</option>
      </select>
    </div>
    
    <!-- Loading -->
    <div v-if="isLoading" class="loading">
      Chargement des exercices...
    </div>
    
    <!-- Exercise List -->
    <div v-else-if="filteredExercises.length > 0" class="exercise-grid">
      <ExerciseCard
        v-for="exercise in filteredExercises"
        :key="exercise.id"
        :exercise="exercise"
        @start="startExercise"
        @edit="editExercise"
        @delete="deleteExercise"
      />
    </div>
    
    <!-- Empty State -->
    <div v-else class="empty-state">
      <p>Aucun exercice trouvé</p>
      <button @click="showCreateForm = true">
        Créer votre premier exercice
      </button>
    </div>
    
    <!-- Create Form Modal -->
    <ExerciseCreateModal
      v-if="showCreateForm"
      @close="showCreateForm = false"
      @created="handleExerciseCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ExerciseCard from '@/components/ExerciseCard.vue'
import ExerciseCreateModal from '@/components/ExerciseCreateModal.vue'
import { useExerciseStore } from '@/stores/exercises'

// Router pour navigation
const router = useRouter()

// Store global (Pinia)
const exerciseStore = useExerciseStore()

// État local du composant
const searchTerm = ref('')
const selectedDifficulty = ref('')
const showCreateForm = ref(false)
const isLoading = ref(false)

// Computed pour filtrer les exercices
const filteredExercises = computed(() => {
  let exercises = exerciseStore.exercises
  
  if (searchTerm.value) {
    exercises = exercises.filter(ex => 
      ex.title.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }
  
  if (selectedDifficulty.value) {
    exercises = exercises.filter(ex => 
      ex.difficulty === selectedDifficulty.value
    )
  }
  
  return exercises
})

// Méthodes
const startExercise = (exerciseId) => {
  router.push(`/training/${exerciseId}`)
}

const editExercise = (exerciseId) => {
  router.push(`/exercises/${exerciseId}/edit`)
}

const deleteExercise = async (exerciseId) => {
  if (confirm('Supprimer cet exercice ?')) {
    await exerciseStore.deleteExercise(exerciseId)
  }
}

const handleExerciseCreated = (newExercise) => {
  showCreateForm.value = false
  exerciseStore.addExercise(newExercise)
}

// Chargement initial
onMounted(async () => {
  isLoading.value = true
  await exerciseStore.fetchExercises()
  isLoading.value = false
})
</script>

<style scoped>
.exercises-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.exercise-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.loading, .empty-state {
  text-align: center;
  padding: 4rem 2rem;
}
</style>
```

## ⚠️ Points d'attention

### Réactivité
```javascript
// ❌ Erreur commune - oublier .value
const count = ref(0)
console.log(count) // Proxy object, pas la valeur !

// ✅ Correct
console.log(count.value) // 0

// ✅ Dans le template, pas besoin de .value
// <p>{{ count }}</p>
```

### Destructuring reactive
```javascript
// ❌ Perd la réactivité
const { title, description } = reactive({ title: 'Test', description: 'Desc' })

// ✅ Garde la réactivité
const exercise = reactive({ title: 'Test', description: 'Desc' })
const { title, description } = toRefs(exercise)
```

## 🔗 Pour aller plus loin

- [[Composition-API|Guide complet Composition API]]
- [[Composants|Architecture des composants]]
- [[Router|Navigation avec Vue Router]]
- [[Pinia-Store|Gestion d'état avec Pinia]]

#vue3 #javascript #frontend #reactive #components