# Pattern Personnalisé - Guide Complet

## 🎯 Vue d'ensemble

Le **pattern personnalisé** permet de créer des exercices de régularité avec une **distribution définie** et flexible. Cette fonctionnalité comble le gap entre les patterns prédéfinis et les besoins spécifiques des entraîneurs.

## 💡 Concept

### Principe de Base

Dans un exercice à distribution, il y a **2 rôles distincts** :

1. **🏓 Le distributeur** (position fixe)
   - Reste toujours à la même position
   - Envoie les balles selon une séquence définie
   - Considéré comme "l'adversaire" dans l'exercice

2. **🎯 Le joueur mobile** (se déplace)
   - Se déplace selon la séquence de distribution
   - Renvoie toujours vers le distributeur
   - Considéré comme "le joueur" dans l'exercice

### Avantages vs Patterns Prédéfinis

| Aspect | Patterns Prédéfinis | Pattern Personnalisé |
|--------|-------------------|---------------------|
| **Configuration** | Fixe (diagonal, parallèle, etc.) | Totalement flexible |
| **Durée** | Basée sur le nombre de balles | Basée sur le temps |
| **Complexité** | Simple, 4 patterns disponibles | Séquences personnalisées |
| **Usage** | Exercices standards | Situations spécifiques |

## 🛠️ Configuration

### 1. Position du Distributeur

Le distributeur reste **fixe** à une position choisie :

```vue
<!-- Interface de sélection -->
<div class="grid grid-cols-3 gap-2">
  <button @click="exercise.distributorPosition = 'BACKHAND'">Revers</button>
  <button @click="exercise.distributorPosition = 'MIDDLE'">Milieu</button>
  <button @click="exercise.distributorPosition = 'FOREHAND'">Coup droit</button>
</div>
```

**Positions disponibles :**
- **Revers** : Côté gauche de la table
- **Milieu** : Centre de la table
- **Coup droit** : Côté droit de la table

### 2. Séquence de Distribution

Définir **où le distributeur envoie les balles** dans l'ordre :

```javascript
// Exemple de séquence
exercise.sequence = ['BACKHAND', 'MIDDLE', 'BACKHAND', 'FOREHAND']

// Se traduit par : Revers → Milieu → Revers → Coup droit (et on recommence)
```

**Interface de configuration :**
```vue
<div v-for="(position, index) in exercise.sequence" :key="index">
  <span>{{ index + 1 }}.</span>
  <div class="grid grid-cols-3 gap-1">
    <button v-for="zone in ['BACKHAND', 'MIDDLE', 'FOREHAND']" 
            @click="updateSequencePosition(index, zone)">
      {{ getZoneLabel(zone) }}
    </button>
  </div>
  <button @click="removeFromSequence(index)">🗑️</button>
</div>
```

### 3. Durée par Joueur

Au lieu de compter les balles, on définit un **temps par joueur** :

```vue
<input v-model.number="exercise.timePerPlayer" 
       type="number" min="1" max="10" step="0.5" />
<span>minutes</span>

<!-- Temps total automatiquement calculé -->
<div>Temps total : {{ exercise.timePerPlayer * 2 }} minutes</div>
```

**Avantages du temps :**
- Plus flexible que compter les balles
- Permet l'adaptation au niveau des joueurs
- Chaque joueur fait la même durée d'exercice

## 🎨 Aperçu Visuel Animé

### CustomPatternPreview Component

L'aperçu montre en temps réel le schéma configuré :

```vue
<template>
  <div class="relative w-full h-48 bg-gradient-to-br from-blue-800 to-blue-900">
    <!-- Table vue du dessus -->
    <div class="absolute inset-2 border-2 border-white border-opacity-30">
      <!-- Position distributeur (fixe, en haut) -->
      <div class="absolute top-4">
        <div class="grid grid-cols-3">
          <div v-for="zone in ['BACKHAND', 'MIDDLE', 'FOREHAND']" 
               :class="distributorPosition === zone ? 'bg-blue-500' : 'bg-white bg-opacity-10'">
            {{ distributorPosition === zone ? '🏓' : '' }}
          </div>
        </div>
      </div>
      
      <!-- Positions du joueur mobile (en bas, animé) -->
      <div class="absolute bottom-4">
        <div class="grid grid-cols-3">
          <div v-for="zone in ['BACKHAND', 'MIDDLE', 'FOREHAND']" 
               :class="isZoneActive(zone) ? 'bg-orange-500 scale-110' : 'bg-white bg-opacity-10'">
            {{ getZoneNumber(zone) }}
          </div>
        </div>
      </div>
      
      <!-- Flèches animées -->
      <svg class="absolute inset-0">
        <!-- Distribution (jaune) -->
        <line :x1="getDistributorX()" y1="25%" 
              :x2="getCurrentTargetX()" y2="75%" 
              stroke="#fbbf24" stroke-width="3" />
        <!-- Retour (bleu pointillé) -->
        <line :x1="getCurrentTargetX()" y1="75%" 
              :x2="getDistributorX()" y2="25%" 
              stroke="#60a5fa" stroke-width="2" stroke-dasharray="5,5" />
      </svg>
    </div>
  </div>
</template>
```

### Animation de la Séquence

```javascript
// Cycle automatique toutes les 1.5 secondes
onMounted(() => {
  interval = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.sequence.length
  }, 1500)
})

// Position actuelle dans la séquence
function getCurrentTargetX() {
  const currentZone = props.sequence[currentIndex.value]
  return `${zonePositions[currentZone]}%`
}

// Afficher les numéros des positions
function getZoneNumber(zone) {
  const indices = []
  props.sequence.forEach((z, i) => {
    if (z === zone) indices.push(i + 1)
  })
  return indices.join(',')
}
```

## 📋 Exemples Pratiques

### Exemple 1 : Travail Revers-Coup Droit

**Configuration :**
- Distributeur : **Milieu**
- Séquence : **Revers → Coup droit → Revers → Coup droit**
- Temps : **3 minutes** par joueur

**Résultat :**
Le distributeur au milieu envoie alternativement en revers et coup droit. Le joueur mobile fait des allers-retours et renvoie toujours au centre.

### Exemple 2 : Fatigue en Revers

**Configuration :**
- Distributeur : **Coup droit** 
- Séquence : **Revers → Revers → Revers → Milieu**
- Temps : **2 minutes** par joueur

**Résultat :**
Le distributeur côté coup droit envoie 3 balles consécutives en revers puis 1 au milieu. Le joueur mobile travaille principalement le revers avec une "pause" au milieu.

### Exemple 3 : Déplacement Complexe

**Configuration :**
- Distributeur : **Revers**
- Séquence : **Coup droit → Milieu → Revers → Coup droit → Milieu**
- Temps : **4 minutes** par joueur

**Résultat :**
Le joueur mobile fait un pattern complexe de déplacements depuis sa position de revers.

## 🎯 Points Techniques Suggérés

Le système suggère automatiquement des points techniques selon le pattern :

```javascript
const suggestedKeyPoints = {
  'custom': [
    'Communication entre distributeur et joueur',
    'Respiration régulière pendant l\'effort', 
    'Adapter la vitesse selon le niveau',
    'Changer de rôle régulièrement'
  ]
}
```

## ⚙️ Implémentation Technique

### Structure des Données

```javascript
const exercise = {
  patternId: 'custom',
  timePerPlayer: 3, // minutes
  distributorPosition: 'MIDDLE',
  sequence: ['BACKHAND', 'FOREHAND', 'BACKHAND', 'FOREHAND'],
  // ... autres champs standards
}
```

### Validation Spécifique

```javascript
const isValid = computed(() => {
  if (exercise.value.patternId === 'custom') {
    return exercise.value.title && 
           exercise.value.timePerPlayer > 0 &&
           exercise.value.distributorPosition &&
           exercise.value.sequence.length > 0
  }
  // ... validation pour autres patterns
})
```

### Génération des Shots

Pour compatibilité avec l'API existante :

```javascript
function generateCustomPatternShots() {
  const distributorPos = getZonePosition(exercise.value.distributorPosition)
  const shots = []
  
  exercise.value.sequence.forEach((targetZone) => {
    const targetPos = getZonePosition(targetZone)
    
    // Shot du distributeur vers la cible
    shots.push({
      startPosition: distributorPos,
      endPosition: targetPos,
      type: 'DRIVE',
      playerSide: 'OPPONENT'
    })
    
    // Shot de retour vers le distributeur  
    shots.push({
      startPosition: targetPos,
      endPosition: distributorPos,
      type: exercise.value.shotType || 'DRIVE',
      playerSide: 'PLAYER'
    })
  })
  
  return shots
}
```

## 🎪 Workflow d'Utilisation

### Création d'un Exercice Personnalisé

1. **Sélectionner "Régularité"** depuis les types d'exercices
2. **Choisir "Personnalisé"** parmi les patterns
3. **Configurer la position du distributeur** (Revers/Milieu/Coup droit)
4. **Définir la séquence** :
   - Ajouter les positions une par une
   - Modifier l'ordre si nécessaire
   - Supprimer les positions non voulues
5. **Fixer le temps par joueur** (recommandé: 2-5 minutes)
6. **Ajouter des points techniques** (suggestions automatiques)
7. **Vérifier l'aperçu animé**
8. **Créer l'exercice**

### Interface Utilisateur

```vue
<!-- Sélection du distributeur -->
<div class="bg-blue-50 rounded-lg p-4">
  <label>📍 Position du distributeur (fixe)</label>
  <div class="grid grid-cols-3 gap-2">
    <!-- 3 boutons pour choisir la position -->
  </div>
</div>

<!-- Configuration de la séquence -->
<div class="bg-orange-50 rounded-lg p-4">
  <label>🎯 Séquence de distribution</label>
  <div class="space-y-2">
    <!-- Liste modifiable des positions -->
  </div>
  <button @click="addToSequence">+ Ajouter une position</button>
</div>

<!-- Aperçu en temps réel -->
<div class="bg-gray-50 rounded-lg p-4">
  <CustomPatternPreview 
    :distributorPosition="exercise.distributorPosition"
    :sequence="exercise.sequence" />
</div>
```

## 🔄 Résumé des Avantages

### Pour les Entraîneurs

1. **Flexibilité totale** : Créer exactement l'exercice voulu
2. **Facilité d'usage** : Interface intuitive avec aperçu visuel
3. **Adaptation au niveau** : Durée basée sur le temps, pas les balles
4. **Visualisation claire** : Animation pour vérifier le schéma

### Pour les Joueurs

1. **Variété** : Patterns uniques et personnalisés
2. **Progression adaptée** : Durée modulable selon le niveau
3. **Clarté** : Rôles bien définis (distributeur vs mobile)
4. **Équité** : Chaque joueur fait la même durée

### Pour le Développement

1. **Extensibilité** : Facile d'ajouter de nouvelles fonctionnalités
2. **Compatibilité** : Fonctionne avec l'API existante
3. **Maintenabilité** : Code modulaire et bien structuré

Le pattern personnalisé offre le **meilleur des deux mondes** : la simplicité des patterns prédéfinis avec la flexibilité d'une configuration sur mesure ! 🎯

#tennis-table #exercices #patterns #personnalisation #distribution #régularité