<template>
  <div class="relative w-full h-48 bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg overflow-hidden">
    <!-- Table vue du dessus -->
    <div class="absolute inset-2 border-2 border-white border-opacity-30 rounded">
      <!-- Filet -->
      <div class="absolute left-0 right-0 h-0.5 bg-white opacity-50 top-1/2"></div>
      
      <!-- Zones délimitées -->
      <div class="absolute inset-0 grid grid-cols-3">
        <div class="border-r border-white border-opacity-20"></div>
        <div class="border-r border-white border-opacity-20"></div>
        <div></div>
      </div>
      
      <!-- Position distributeur (en haut) -->
      <div class="absolute top-4 left-0 right-0">
        <div class="grid grid-cols-3 gap-2 px-2">
          <div v-for="zone in ['BACKHAND', 'MIDDLE', 'FOREHAND']" :key="zone"
               :class="[
                 'h-8 rounded flex items-center justify-center text-xs font-medium transition-all duration-300',
                 distributorPosition === zone 
                   ? 'bg-blue-500 text-white shadow-lg transform scale-105' 
                   : 'bg-white bg-opacity-10'
               ]">
            {{ distributorPosition === zone ? '🏓' : '' }}
          </div>
        </div>
      </div>
      
      <!-- Animation de la séquence (en bas) -->
      <div class="absolute bottom-4 left-0 right-0">
        <div class="grid grid-cols-3 gap-2 px-2">
          <div v-for="(zone, index) in ['BACKHAND', 'MIDDLE', 'FOREHAND']" :key="zone"
               :class="[
                 'h-8 rounded flex items-center justify-center text-xs font-bold transition-all duration-300',
                 isZoneActive(zone) 
                   ? 'bg-orange-500 text-white scale-110 shadow-lg' 
                   : 'bg-white bg-opacity-10'
               ]">
            {{ getZoneNumber(zone) }}
          </div>
        </div>
      </div>
      
      <!-- Flèches animées -->
      <svg class="absolute inset-0 w-full h-full pointer-events-none">
        <!-- Flèche de distribution (jaune) -->
        <line 
          :x1="getDistributorX()" 
          y1="25%" 
          :x2="getCurrentTargetX()" 
          y2="75%" 
          stroke="#fbbf24" 
          stroke-width="3"
          marker-end="url(#arrowhead)"
          class="transition-all duration-500"
          opacity="0.9"
        />
        
        <!-- Flèche de retour (bleue pointillée) -->
        <line 
          :x1="getCurrentTargetX()" 
          y1="75%" 
          :x2="getDistributorX()" 
          y2="25%" 
          stroke="#60a5fa" 
          stroke-width="2"
          marker-end="url(#arrowhead2)"
          stroke-dasharray="5,5"
          class="transition-all duration-500"
          opacity="0.8"
        />
        
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                  refX="9" refY="3.5" orient="auto" fill="#fbbf24">
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
          <marker id="arrowhead2" markerWidth="10" markerHeight="7" 
                  refX="9" refY="3.5" orient="auto" fill="#60a5fa">
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>
      </svg>
      
      <!-- Indicateur de la position actuelle dans la séquence -->
      <div class="absolute top-1 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        Position {{ currentIndex + 1 }}/{{ sequence.length }}
      </div>
    </div>
    
    <!-- Labels -->
    <div class="absolute top-1 left-2 text-white text-xs opacity-70 bg-black bg-opacity-30 px-2 py-1 rounded">
      🏓 Distributeur
    </div>
    <div class="absolute bottom-1 left-2 text-white text-xs opacity-70 bg-black bg-opacity-30 px-2 py-1 rounded">
      🎯 Joueur mobile
    </div>
    
    <!-- Légende -->
    <div class="absolute bottom-1 right-2 text-white text-xs opacity-70">
      <div class="bg-black bg-opacity-30 px-2 py-1 rounded space-y-1">
        <div class="flex items-center space-x-1">
          <div class="w-3 h-0.5 bg-yellow-400"></div>
          <span>Distribution</span>
        </div>
        <div class="flex items-center space-x-1">
          <div class="w-3 h-0.5 bg-blue-400 border-dashed border-t"></div>
          <span>Retour</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  distributorPosition: {
    type: String,
    default: 'BACKHAND'
  },
  sequence: {
    type: Array,
    default: () => ['BACKHAND', 'MIDDLE', 'FOREHAND']
  }
})

const currentIndex = ref(0)
let interval = null

onMounted(() => {
  if (props.sequence.length > 1) {
    // Animation de la séquence
    interval = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % props.sequence.length
    }, 1500)
  }
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

const zonePositions = {
  'BACKHAND': 16.6,
  'MIDDLE': 50,
  'FOREHAND': 83.3
}

function getDistributorX() {
  return `${zonePositions[props.distributorPosition]}%`
}

function getCurrentTargetX() {
  const currentZone = props.sequence[currentIndex.value]
  return `${zonePositions[currentZone]}%`
}

function isZoneActive(zone) {
  return props.sequence[currentIndex.value] === zone
}

function getZoneNumber(zone) {
  // Afficher les numéros des positions dans la séquence
  const indices = []
  props.sequence.forEach((z, i) => {
    if (z === zone) indices.push(i + 1)
  })
  return indices.length > 0 ? indices.join(',') : ''
}
</script>

<style scoped>
/* Animation pour les flèches */
svg line {
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

/* Animation de pulsation pour les éléments actifs */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 2s infinite;
}
</style>