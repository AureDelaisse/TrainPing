<template>
  <div class="relative w-full h-48 bg-gradient-to-br from-green-800 to-green-900 rounded-lg overflow-hidden">
    <!-- Table simplifiée -->
    <div class="absolute inset-0 flex items-center justify-center">
      <!-- Bordures de table -->
      <div class="absolute inset-4 border-2 border-white border-opacity-30 rounded"></div>
      
      <!-- Filet central -->
      <div class="absolute w-full h-1 bg-white opacity-60 top-1/2 transform -translate-y-0.5"></div>
      <div class="absolute w-full h-0.5 bg-white top-1/2 transform -translate-y-0.5"></div>
      
      <!-- Zone de service (optionnel) -->
      <div v-if="pattern?.id === 'service'" class="absolute inset-x-4 top-1/2 h-px bg-white opacity-20"></div>
      
      <!-- Trajectoires selon le pattern -->
      <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <!-- Marqueurs de flèches -->
          <marker id="arrowPlayer" markerWidth="8" markerHeight="6" 
                  refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
            <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
          </marker>
          <marker id="arrowOpponent" markerWidth="8" markerHeight="6" 
                  refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
            <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
          </marker>
        </defs>
        
        <!-- Pattern Diagonal -->
        <template v-if="pattern?.id === 'diagonal'">
          <!-- Joueur : bas gauche vers haut droite -->
          <line x1="20" y1="80" x2="80" y2="20" 
                stroke="#3b82f6" stroke-width="3" 
                marker-end="url(#arrowPlayer)" 
                opacity="0.9" />
          <!-- Adversaire : haut droite vers bas gauche -->
          <line x1="80" y1="20" x2="20" y2="80" 
                stroke="#f59e0b" stroke-width="2" 
                marker-end="url(#arrowOpponent)"
                stroke-dasharray="4,2" 
                opacity="0.8" />
          
          <!-- Numérotation -->
          <circle cx="50" cy="50" r="8" fill="white" opacity="0.9" />
          <text x="50" y="55" text-anchor="middle" font-size="8" font-weight="bold" fill="#374151">1-2</text>
        </template>
        
        <!-- Pattern Parallèle -->
        <template v-if="pattern?.id === 'parallel'">
          <!-- Joueur : bas gauche vers haut gauche -->
          <line x1="20" y1="80" x2="20" y2="20" 
                stroke="#3b82f6" stroke-width="3" 
                marker-end="url(#arrowPlayer)" 
                opacity="0.9" />
          <!-- Adversaire : haut gauche vers bas gauche -->
          <line x1="20" y1="20" x2="20" y2="80" 
                stroke="#f59e0b" stroke-width="2" 
                marker-end="url(#arrowOpponent)"
                stroke-dasharray="4,2" 
                opacity="0.8" />
          
          <!-- Numérotation -->
          <circle cx="35" cy="50" r="8" fill="white" opacity="0.9" />
          <text x="35" y="55" text-anchor="middle" font-size="8" font-weight="bold" fill="#374151">1-2</text>
        </template>
        
        <!-- Pattern Pivot -->
        <template v-if="pattern?.id === 'pivot'">
          <!-- Joueur : centre vers gauche -->
          <line x1="50" y1="80" x2="20" y2="20" 
                stroke="#3b82f6" stroke-width="3" 
                marker-end="url(#arrowPlayer)" 
                opacity="0.9" />
          <!-- Adversaire : gauche vers droite -->
          <line x1="20" y1="20" x2="80" y2="80" 
                stroke="#f59e0b" stroke-width="2" 
                marker-end="url(#arrowOpponent)"
                stroke-dasharray="4,2" 
                opacity="0.8" />
          
          <!-- Numérotation -->
          <circle cx="50" cy="50" r="8" fill="white" opacity="0.9" />
          <text x="50" y="55" text-anchor="middle" font-size="8" font-weight="bold" fill="#374151">1-2</text>
        </template>
        
        <!-- Pattern Axe central -->
        <template v-if="pattern?.id === 'middle'">
          <!-- Joueur : centre bas vers centre haut -->
          <line x1="50" y1="80" x2="50" y2="20" 
                stroke="#3b82f6" stroke-width="3" 
                marker-end="url(#arrowPlayer)" 
                opacity="0.9" />
          <!-- Adversaire : centre haut vers centre bas -->
          <line x1="50" y1="20" x2="50" y2="80" 
                stroke="#f59e0b" stroke-width="2" 
                marker-end="url(#arrowOpponent)"
                stroke-dasharray="4,2" 
                opacity="0.8" />
          
          <!-- Numérotation -->
          <circle cx="65" cy="50" r="8" fill="white" opacity="0.9" />
          <text x="65" y="55" text-anchor="middle" font-size="8" font-weight="bold" fill="#374151">1-2</text>
        </template>
      </svg>
      
      <!-- Labels des joueurs -->
      <div class="absolute bottom-2 left-2 text-white text-xs font-medium bg-blue-600 bg-opacity-80 px-2 py-1 rounded">
        🟦 Joueur
      </div>
      <div class="absolute top-2 right-2 text-white text-xs font-medium bg-orange-500 bg-opacity-80 px-2 py-1 rounded">
        🟧 Adversaire
      </div>
      
      <!-- Informations du pattern -->
      <div v-if="pattern" class="absolute top-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
        {{ pattern.name }}
      </div>
    </div>
    
    <!-- Overlay avec détails -->
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
      <div class="text-white text-xs space-y-1">
        <div v-if="settings?.shotType" class="flex items-center space-x-2">
          <span class="font-medium">Coup:</span>
          <span>{{ getShotTypeLabel(settings.shotType) }}</span>
        </div>
        <div v-if="settings?.speed" class="flex items-center space-x-2">
          <span class="font-medium">Vitesse:</span>
          <span>{{ getSpeedLabel(settings.speed) }}</span>
        </div>
        <div v-if="settings?.ballsPerSeries" class="flex items-center space-x-2">
          <span class="font-medium">Répétitions:</span>
          <span>{{ settings.ballsPerSeries }} balles par série</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pattern: {
    type: Object,
    default: null
  },
  settings: {
    type: Object,
    default: () => ({})
  }
})

// Labels pour l'affichage
const getShotTypeLabel = (shotType) => {
  const labels = {
    'FOREHAND': 'Coup droit',
    'BACKHAND': 'Revers',
    'BOTH': 'CD + Revers'
  }
  return labels[shotType] || shotType
}

const getSpeedLabel = (speed) => {
  const labels = {
    'SLOW': '🐢 Lent',
    'MEDIUM': '🚶 Moyen',
    'FAST': '🏃 Rapide'
  }
  return labels[speed] || speed
}
</script>

<style scoped>
/* Animation pour les trajectoires */
svg line {
  animation: drawLine 2s ease-in-out infinite;
}

@keyframes drawLine {
  0% {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
  }
  50% {
    stroke-dasharray: 1000;
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dasharray: 1000;
    stroke-dashoffset: 0;
  }
}

/* Pause animation au hover */
svg:hover line {
  animation-play-state: paused;
}
</style>