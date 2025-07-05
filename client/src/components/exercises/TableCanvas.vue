<template>
  <div class="flex flex-col lg:flex-row gap-6">
    <!-- Canvas Container -->
    <div class="flex-1">
      <div 
        ref="canvasContainer" 
        class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border-2 border-emerald-200 overflow-hidden"
        style="width: 100%; height: 450px;"
      ></div>
      
      <!-- Canvas Controls -->
      <div class="mt-4 flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
        <div class="flex items-center space-x-4 text-sm text-gray-600">
          <span>🎯 <strong>{{ shots.length }}</strong> trajectoire(s)</span>
          <span>📏 Cliquez et glissez pour dessiner</span>
        </div>
        <div class="flex items-center space-x-2">
          <button 
            @click="clearAllShots"
            :disabled="shots.length === 0"
            class="px-3 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🗑️ Tout effacer
          </button>
        </div>
      </div>
    </div>

    <!-- Side Panel -->
    <div class="w-full lg:w-80 space-y-6">
      <!-- Shot List -->
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Trajectoires ({{ shots.length }})</h3>
          <button 
            @click="showManualForm = !showManualForm"
            class="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
          >
            ➕ Ajouter manuellement
          </button>
        </div>

        <!-- Manual Add Form -->
        <div v-if="showManualForm" class="mb-4 p-4 bg-gray-50 rounded-lg border">
          <h4 class="font-medium text-gray-900 mb-3">Nouveau coup</h4>
          <div class="space-y-3">
            <!-- Type -->
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Type</label>
              <select v-model="manualShot.type" class="w-full text-sm border border-gray-300 rounded px-2 py-1">
                <option value="SERVE">🏓 Service</option>
                <option value="DRIVE">⚡ Coup droit</option>
                <option value="BACKHAND">🔄 Revers</option>
                <option value="TOPSPIN">↗️ Top spin</option>
                <option value="BACKSPIN">↘️ Back spin</option>
                <option value="SMASH">💥 Smash</option>
                <option value="PUSH">👋 Poussette</option>
                <option value="BLOCK">🛡️ Bloc</option>
              </select>
            </div>

            <!-- Spin -->
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Effet</label>
              <select v-model="manualShot.spin" class="w-full text-sm border border-gray-300 rounded px-2 py-1">
                <option value="NONE">Sans effet</option>
                <option value="TOPSPIN">Lifté</option>
                <option value="BACKSPIN">Coupé</option>
                <option value="SIDESPIN">Latéral</option>
              </select>
            </div>

            <!-- Direction avec grille 3x3 réaliste -->
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Direction tennis de table</label>
              <div class="grid grid-cols-3 gap-1 p-2 bg-gray-50 rounded">
                <!-- Ligne 1: Court -->
                <button 
                  @click="selectTableDirection('backhand-short')"
                  :class="[
                    'p-2 text-xs rounded border hover:bg-blue-50 font-medium',
                    selectedDirectionId === 'backhand-short' ? 'bg-blue-100 border-blue-300 text-blue-600' : 'bg-white border-gray-200'
                  ]"
                >
                  R Court
                </button>
                <button 
                  @click="selectTableDirection('middle-short')"
                  :class="[
                    'p-2 text-xs rounded border hover:bg-blue-50 font-medium',
                    selectedDirectionId === 'middle-short' ? 'bg-blue-100 border-blue-300 text-blue-600' : 'bg-white border-gray-200'
                  ]"
                >
                  M Court
                </button>
                <button 
                  @click="selectTableDirection('forehand-short')"
                  :class="[
                    'p-2 text-xs rounded border hover:bg-blue-50 font-medium',
                    selectedDirectionId === 'forehand-short' ? 'bg-blue-100 border-blue-300 text-blue-600' : 'bg-white border-gray-200'
                  ]"
                >
                  CD Court
                </button>
                
                <!-- Ligne 2: Normal -->
                <button 
                  @click="selectTableDirection('backhand-normal')"
                  :class="[
                    'p-2 text-xs rounded border hover:bg-blue-50 font-medium',
                    selectedDirectionId === 'backhand-normal' ? 'bg-blue-100 border-blue-300 text-blue-600' : 'bg-white border-gray-200'
                  ]"
                >
                  R Normal
                </button>
                <button 
                  @click="selectTableDirection('middle-normal')"
                  :class="[
                    'p-2 text-xs rounded border hover:bg-blue-50 font-medium',
                    selectedDirectionId === 'middle-normal' ? 'bg-blue-100 border-blue-300 text-blue-600' : 'bg-white border-gray-200'
                  ]"
                >
                  M Normal
                </button>
                <button 
                  @click="selectTableDirection('forehand-normal')"
                  :class="[
                    'p-2 text-xs rounded border hover:bg-blue-50 font-medium',
                    selectedDirectionId === 'forehand-normal' ? 'bg-blue-100 border-blue-300 text-blue-600' : 'bg-white border-gray-200'
                  ]"
                >
                  CD Normal
                </button>
                
                <!-- Ligne 3: Long -->
                <button 
                  @click="selectTableDirection('backhand-long')"
                  :class="[
                    'p-2 text-xs rounded border hover:bg-blue-50 font-medium',
                    selectedDirectionId === 'backhand-long' ? 'bg-blue-100 border-blue-300 text-blue-600' : 'bg-white border-gray-200'
                  ]"
                >
                  R Long
                </button>
                <button 
                  @click="selectTableDirection('middle-long')"
                  :class="[
                    'p-2 text-xs rounded border hover:bg-blue-50 font-medium',
                    selectedDirectionId === 'middle-long' ? 'bg-blue-100 border-blue-300 text-blue-600' : 'bg-white border-gray-200'
                  ]"
                >
                  M Long
                </button>
                <button 
                  @click="selectTableDirection('forehand-long')"
                  :class="[
                    'p-2 text-xs rounded border hover:bg-blue-50 font-medium',
                    selectedDirectionId === 'forehand-long' ? 'bg-blue-100 border-blue-300 text-blue-600' : 'bg-white border-gray-200'
                  ]"
                >
                  CD Long
                </button>
              </div>
              <div class="text-xs text-gray-500 mt-1 px-1">
                R=Revers, M=Milieu, CD=Coup droit
              </div>
            </div>

            <!-- Speed -->
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Vitesse</label>
              <select v-model="manualShot.speed" class="w-full text-sm border border-gray-300 rounded px-2 py-1">
                <option value="SLOW">🐢 Lent</option>
                <option value="MEDIUM">🚶 Moyen</option>
                <option value="FAST">🏃 Rapide</option>
              </select>
            </div>

            <!-- Info alternance automatique -->
            <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <p class="text-xs text-blue-700">
                  <strong>Alternance automatique :</strong> 
                  {{ props.shots.length % 2 === 0 ? '🟦 Joueur' : '🟧 Adversaire' }} à jouer
                </p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2 pt-2">
              <button 
                @click="addManualShot"
                :disabled="!selectedDirectionId"
                class="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                ✅ Ajouter
              </button>
              <button 
                @click="showManualForm = false"
                class="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                ❌
              </button>
            </div>
          </div>
        </div>

        <!-- Shots List -->
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div 
            v-for="(shot, index) in shots" 
            :key="index"
            @click="selectShot(index)"
            :class="[
              'flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors',
              selectedShotIndex === index ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'
            ]"
          >
            <!-- Number Circle -->
            <div 
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                shot.playerSide === 'PLAYER' ? 'bg-blue-100 text-blue-600 border-2 border-blue-300' : 'bg-orange-100 text-orange-600 border-2 border-orange-300'
              ]"
            >
              {{ index + 1 }}
            </div>

            <!-- Shot Details -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ getShotTypeLabel(shot.type) }} • {{ getShotSpinLabel(shot.spin) }} • {{ getShotSpeedLabel(shot.speed) }}
              </p>
              <p class="text-xs text-gray-500">
                {{ shot.playerSide === 'PLAYER' ? '🟦 Joueur' : '🟧 Adversaire' }}
              </p>
            </div>

            <!-- Delete Button -->
            <button 
              @click.stop="removeShot(index)"
              class="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
              title="Supprimer"
            >
              🗑️
            </button>
          </div>

          <!-- Empty State -->
          <div v-if="shots.length === 0" class="text-center py-8 text-gray-500">
            <div class="text-4xl mb-2">🎯</div>
            <p class="text-sm">Aucune trajectoire</p>
            <p class="text-xs">Dessinez sur la table ou ajoutez manuellement</p>
          </div>
        </div>
      </div>

      <!-- Shot Properties (when selected) -->
      <div v-if="selectedShotIndex !== null" class="bg-white rounded-xl p-6 border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-semibold text-gray-900">Trajectoire {{ selectedShotIndex + 1 }}</h4>
          <button 
            @click="selectedShotIndex = null"
            class="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div class="space-y-4">
          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type de coup</label>
            <select
              v-model="shots[selectedShotIndex].type"
              @change="updateShot"
              class="w-full text-sm border border-gray-300 rounded px-3 py-2"
            >
              <option value="SERVE">🏓 Service</option>
              <option value="DRIVE">⚡ Coup droit</option>
              <option value="BACKHAND">🔄 Revers</option>
              <option value="TOPSPIN">↗️ Top spin</option>
              <option value="BACKSPIN">↘️ Back spin</option>
              <option value="SMASH">💥 Smash</option>
              <option value="PUSH">👋 Poussette</option>
              <option value="BLOCK">🛡️ Bloc</option>
            </select>
          </div>

          <!-- Spin -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Effet</label>
            <select
              v-model="shots[selectedShotIndex].spin"
              @change="updateShot"
              class="w-full text-sm border border-gray-300 rounded px-3 py-2"
            >
              <option value="NONE">Sans effet</option>
              <option value="TOPSPIN">Lifté</option>
              <option value="BACKSPIN">Coupé</option>
              <option value="SIDESPIN">Latéral</option>
            </select>
          </div>

          <!-- Speed -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Vitesse</label>
            <select
              v-model="shots[selectedShotIndex].speed"
              @change="updateShot"
              class="w-full text-sm border border-gray-300 rounded px-3 py-2"
            >
              <option value="SLOW">🐢 Lent</option>
              <option value="MEDIUM">🚶 Moyen</option>
              <option value="FAST">🏃 Rapide</option>
            </select>
          </div>

          <!-- Player Side -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Côté joueur</label>
            <div class="grid grid-cols-2 gap-2">
              <button 
                @click="shots[selectedShotIndex].playerSide = 'PLAYER'; updateShot()"
                :class="[
                  'p-2 text-sm rounded border',
                  shots[selectedShotIndex].playerSide === 'PLAYER' ? 'bg-blue-100 border-blue-300 text-blue-600' : 'bg-white border-gray-200'
                ]"
              >
                🟦 Joueur
              </button>
              <button 
                @click="shots[selectedShotIndex].playerSide = 'OPPONENT'; updateShot()"
                :class="[
                  'p-2 text-sm rounded border',
                  shots[selectedShotIndex].playerSide === 'OPPONENT' ? 'bg-orange-100 border-orange-300 text-orange-600' : 'bg-white border-gray-200'
                ]"
              >
                🟧 Adversaire
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, defineProps, defineEmits } from 'vue'
import Konva from 'konva'

const props = defineProps({
  shots: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['shot-added', 'shot-updated', 'shot-removed'])

// Refs
const canvasContainer = ref(null)
const selectedShotIndex = ref(null)
const showManualForm = ref(false)

// Konva objects
let stage = null
let tableLayer = null
let shotsLayer = null
let tempLayer = null

// Drawing state
const isDrawing = ref(false)
const startPoint = ref(null)
const previewArrow = ref(null)

// Manual shot form
const manualShot = ref({
  type: 'DRIVE',
  spin: 'NONE',
  speed: 'MEDIUM',
  playerSide: 'PLAYER'
})

const selectedDirection = ref(null)
const selectedDirectionId = ref(null)

// 9 directions réalistes : 3 zones (Revers/Milieu/Coup droit) × 3 profondeurs (court/normal/long)
const tableDirections = [
  // REVERS (côté gauche - x: 0.2 à 0.4)
  { id: 'backhand-short', label: 'R Court', zone: 'revers', x: 0.3, depth: 0.3 },
  { id: 'backhand-normal', label: 'R Normal', zone: 'revers', x: 0.3, depth: 0.5 },
  { id: 'backhand-long', label: 'R Long', zone: 'revers', x: 0.3, depth: 0.7 },
  
  // MILIEU (centre - x: 0.4 à 0.6)
  { id: 'middle-short', label: 'M Court', zone: 'milieu', x: 0.5, depth: 0.3 },
  { id: 'middle-normal', label: 'M Normal', zone: 'milieu', x: 0.5, depth: 0.5 },
  { id: 'middle-long', label: 'M Long', zone: 'milieu', x: 0.5, depth: 0.7 },
  
  // COUP DROIT (côté droit - x: 0.6 à 0.8)
  { id: 'forehand-short', label: 'CD Court', zone: 'coup-droit', x: 0.7, depth: 0.3 },
  { id: 'forehand-normal', label: 'CD Normal', zone: 'coup-droit', x: 0.7, depth: 0.5 },
  { id: 'forehand-long', label: 'CD Long', zone: 'coup-droit', x: 0.7, depth: 0.7 }
]

// Initialize Konva canvas
const initCanvas = () => {
  if (!canvasContainer.value) return

  const container = canvasContainer.value
  const containerWidth = container.offsetWidth
  const containerHeight = 450

  // Create stage
  stage = new Konva.Stage({
    container: container,
    width: containerWidth,
    height: containerHeight
  })

  // Create layers
  tableLayer = new Konva.Layer()
  shotsLayer = new Konva.Layer()
  tempLayer = new Konva.Layer()

  // Add layers to stage
  stage.add(tableLayer)
  stage.add(shotsLayer)
  stage.add(tempLayer)

  // Draw table
  drawTable()

  // Set up event listeners
  setupEventListeners()

  // Render initial shots
  renderShots()
}

// Draw ping pong table
const drawTable = () => {
  const width = stage.width()
  const height = stage.height()
  
  // Table background
  const tableBackground = new Konva.Rect({
    x: 0,
    y: 0,
    width: width,
    height: height,
    fill: '#10b981', // emerald-500
    strokeWidth: 4,
    stroke: '#047857' // emerald-700
  })
  
  // Table border
  const tableBorder = new Konva.Rect({
    x: width * 0.05,
    y: height * 0.15,
    width: width * 0.9,
    height: height * 0.7,
    fill: 'transparent',
    stroke: '#065f46', // emerald-800
    strokeWidth: 3
  })

  // Center line
  const centerLine = new Konva.Line({
    points: [width * 0.5, height * 0.15, width * 0.5, height * 0.85],
    stroke: '#065f46',
    strokeWidth: 2
  })

  // Net (improved visibility)
  const net = new Konva.Line({
    points: [width * 0.05, height * 0.5, width * 0.95, height * 0.5],
    stroke: '#ffffff', // White color
    strokeWidth: 6, // Thicker
    dash: [10, 5] // Dashed style
  })

  // Add zones for better visualization
  drawTableZones(width, height)

  // Add to table layer
  tableLayer.add(tableBackground)
  tableLayer.add(tableBorder)
  tableLayer.add(centerLine)
  tableLayer.add(net)
  tableLayer.draw()
}

// Draw table zones (Revers/Milieu/Coup droit & Court/Normal/Long)
const drawTableZones = (width, height) => {
  // Lignes verticales pour délimiter revers/milieu/coup droit
  const verticalZones = [0.33, 0.66] // Tiers de la table
  
  verticalZones.forEach(ratio => {
    const x = width * 0.05 + (width * 0.9) * ratio
    const line = new Konva.Line({
      points: [x, height * 0.15, x, height * 0.85],
      stroke: '#ffffff',
      strokeWidth: 1,
      opacity: 0.2,
      dash: [5, 10]
    })
    tableLayer.add(line)
  })
  
  // Lignes horizontales pour les profondeurs (court/normal/long)
  const horizontalZones = [0.3, 0.7] // Court/Normal/Long
  
  horizontalZones.forEach(ratio => {
    const y = height * 0.15 + (height * 0.7) * ratio
    const line = new Konva.Line({
      points: [width * 0.05, y, width * 0.95, y],
      stroke: '#ffffff',
      strokeWidth: 1,
      opacity: 0.2,
      dash: [5, 10]
    })
    tableLayer.add(line)
  })
}

// Setup event listeners for drawing
const setupEventListeners = () => {
  stage.on('mousedown touchstart', (e) => {
    if (e.target !== stage) return // Only on empty space
    
    const pos = stage.getPointerPosition()
    const normalizedPos = {
      x: pos.x / stage.width(),
      y: pos.y / stage.height()
    }
    
    // Check if within table bounds
    if (normalizedPos.x < 0.05 || normalizedPos.x > 0.95 || 
        normalizedPos.y < 0.15 || normalizedPos.y > 0.85) return
    
    isDrawing.value = true
    startPoint.value = normalizedPos
    selectedShotIndex.value = null
  })

  stage.on('mousemove touchmove', (e) => {
    if (!isDrawing.value || !startPoint.value) return
    
    const pos = stage.getPointerPosition()
    const normalizedPos = {
      x: pos.x / stage.width(),
      y: pos.y / stage.height()
    }
    
    // Update preview arrow
    updatePreviewArrow(startPoint.value, normalizedPos)
  })

  stage.on('mouseup touchend', (e) => {
    if (!isDrawing.value || !startPoint.value) return
    
    const pos = stage.getPointerPosition()
    const normalizedPos = {
      x: pos.x / stage.width(),
      y: pos.y / stage.height()
    }
    
    // Check minimum distance
    const distance = Math.sqrt(
      Math.pow(normalizedPos.x - startPoint.value.x, 2) + 
      Math.pow(normalizedPos.y - startPoint.value.y, 2)
    )
    
    if (distance > 0.05) { // Minimum distance
      // Déterminer automatiquement le joueur selon l'alternance
      const isPlayerTurn = props.shots.length % 2 === 0
      
      // Créer le coup avec logique réaliste
      const newShot = createRealisticShot(startPoint.value, normalizedPos, isPlayerTurn)
      
      emit('shot-added', newShot)
    }
    
    // Clean up
    isDrawing.value = false
    startPoint.value = null
    clearPreview()
  })
}

// Update preview arrow during drawing
const updatePreviewArrow = (start, end) => {
  clearPreview()
  
  const arrow = createArrow(start, end, '#3b82f6', 3, true)
  tempLayer.add(arrow)
  tempLayer.draw()
  previewArrow.value = arrow
}

// Clear preview
const clearPreview = () => {
  tempLayer.removeChildren()
  tempLayer.draw()
  previewArrow.value = null
}

// Create arrow shape
const createArrow = (start, end, color, strokeWidth = 4, isDashed = false) => {
  const width = stage.width()
  const height = stage.height()
  
  const startX = start.x * width
  const startY = start.y * height
  const endX = end.x * width
  const endY = end.y * height
  
  // Calculate arrow points
  const headlen = 15
  const angle = Math.atan2(endY - startY, endX - startX)
  
  const arrowPoints = [
    startX, startY,
    endX, endY,
    endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6),
    endX, endY,
    endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6)
  ]
  
  return new Konva.Line({
    points: arrowPoints,
    fill: color,
    stroke: color,
    strokeWidth: strokeWidth,
    lineCap: 'round',
    lineJoin: 'round',
    dash: isDashed ? [8, 4] : undefined
  })
}

// Render all shots
const renderShots = () => {
  shotsLayer.removeChildren()
  
  props.shots.forEach((shot, index) => {
    const color = shot.playerSide === 'PLAYER' ? '#3b82f6' : '#ea580c' // blue or orange
    
    // Create arrow
    const arrow = createArrow(shot.startPosition, shot.endPosition, color)
    
    // Add hover effects
    arrow.on('mouseenter', () => {
      arrow.strokeWidth(6)
      stage.container().style.cursor = 'pointer'
      shotsLayer.draw()
    })
    
    arrow.on('mouseleave', () => {
      arrow.strokeWidth(4)
      stage.container().style.cursor = 'default'
      shotsLayer.draw()
    })
    
    // Add click handler
    arrow.on('click tap', () => {
      selectShot(index)
    })
    
    shotsLayer.add(arrow)
    
    // Add number circle in the middle
    const midX = (shot.startPosition.x + shot.endPosition.x) / 2 * stage.width()
    const midY = (shot.startPosition.y + shot.endPosition.y) / 2 * stage.height()
    
    const circle = new Konva.Circle({
      x: midX,
      y: midY,
      radius: 16,
      fill: '#ffffff',
      stroke: color,
      strokeWidth: 3
    })
    
    const text = new Konva.Text({
      x: midX,
      y: midY,
      text: (index + 1).toString(),
      fontSize: 14,
      fontFamily: 'Arial',
      fontStyle: 'bold',
      fill: color,
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 6,
      offsetY: 7
    })
    
    // Add click handlers to number
    circle.on('click tap', () => selectShot(index))
    text.on('click tap', () => selectShot(index))
    
    shotsLayer.add(circle)
    shotsLayer.add(text)
  })
  
  shotsLayer.draw()
}

// Créer un coup réaliste selon la logique tennis de table
const createRealisticShot = (start, end, isPlayerTurn) => {
  // Ajuster les positions selon le joueur
  let startPos, endPos
  
  if (isPlayerTurn) {
    // Joueur frappe : du bas vers le haut
    startPos = { x: start.x, y: Math.max(start.y, 0.6) } // Assurer qu'on part du bas
    endPos = { x: end.x, y: Math.min(end.y, 0.4) } // Assurer qu'on arrive en haut
  } else {
    // Adversaire frappe : du haut vers le bas
    startPos = { x: start.x, y: Math.min(start.y, 0.4) } // Assurer qu'on part du haut
    endPos = { x: end.x, y: Math.max(end.y, 0.6) } // Assurer qu'on arrive en bas
  }
  
  return {
    startPosition: startPos,
    endPosition: endPos,
    type: 'DRIVE',
    spin: 'NONE',
    speed: 'MEDIUM',
    playerSide: isPlayerTurn ? 'PLAYER' : 'OPPONENT'
  }
}

// Calculer les positions pour l'ajout manuel
const calculateShotPositions = (directionId, playerSide, previousShot = null) => {
  const direction = tableDirections.find(d => d.id === directionId)
  if (!direction) return null
  
  let startPos, endPos
  
  // Position de départ
  if (previousShot) {
    // Continuer depuis la fin du coup précédent
    startPos = { ...previousShot.endPosition }
  } else {
    // Premier coup : milieu de notre côté
    startPos = { x: 0.5, y: playerSide === 'PLAYER' ? 0.8 : 0.2 }
  }
  
  // Position d'arrivée selon la direction et le joueur
  if (playerSide === 'PLAYER') {
    // Joueur frappe vers le haut (adversaire)
    endPos = {
      x: direction.x,
      y: 0.15 + (1 - direction.depth) * 0.35 // Plus c'est profond, plus c'est vers le haut
    }
  } else {
    // Adversaire frappe vers le bas (joueur)
    endPos = {
      x: direction.x,
      y: 0.5 + direction.depth * 0.35 // Plus c'est profond, plus c'est vers le bas
    }
  }
  
  return { startPos, endPos }
}

// Shot management functions
const selectShot = (index) => {
  selectedShotIndex.value = selectedShotIndex.value === index ? null : index
}

const updateShot = () => {
  if (selectedShotIndex.value !== null) {
    emit('shot-updated', selectedShotIndex.value, props.shots[selectedShotIndex.value])
    renderShots()
  }
}

const removeShot = (index) => {
  emit('shot-removed', index)
  if (selectedShotIndex.value === index) {
    selectedShotIndex.value = null
  } else if (selectedShotIndex.value > index) {
    selectedShotIndex.value--
  }
}

const clearAllShots = () => {
  while (props.shots.length > 0) {
    emit('shot-removed', 0)
  }
  selectedShotIndex.value = null
}

// Manual shot functions
const selectTableDirection = (directionId) => {
  selectedDirectionId.value = directionId
  const direction = tableDirections.find(d => d.id === directionId)
  selectedDirection.value = direction
}

const addManualShot = () => {
  if (!selectedDirectionId.value) return
  
  // Déterminer le joueur selon l'alternance
  const isPlayerTurn = props.shots.length % 2 === 0
  const playerSide = isPlayerTurn ? 'PLAYER' : 'OPPONENT'
  
  // Calculer les positions
  const previousShot = props.shots.length > 0 ? props.shots[props.shots.length - 1] : null
  const positions = calculateShotPositions(selectedDirectionId.value, playerSide, previousShot)
  
  if (!positions) return
  
  const newShot = {
    startPosition: positions.startPos,
    endPosition: positions.endPos,
    type: manualShot.value.type,
    spin: manualShot.value.spin,
    speed: manualShot.value.speed,
    playerSide: playerSide
  }
  
  emit('shot-added', newShot)
  
  // Reset form
  resetManualForm()
}

const resetManualForm = () => {
  selectedDirection.value = null
  selectedDirectionId.value = null
  showManualForm.value = false
}

// Helper functions for labels
const getShotTypeLabel = (type) => {
  const types = {
    'SERVE': '🏓 Service',
    'DRIVE': '⚡ Coup droit',
    'BACKHAND': '🔄 Revers',
    'TOPSPIN': '↗️ Top spin',
    'BACKSPIN': '↘️ Back spin',
    'SMASH': '💥 Smash',
    'PUSH': '👋 Poussette',
    'BLOCK': '🛡️ Bloc'
  }
  return types[type] || type
}

const getShotSpinLabel = (spin) => {
  const spins = {
    'NONE': 'Sans effet',
    'TOPSPIN': 'Lifté',
    'BACKSPIN': 'Coupé',
    'SIDESPIN': 'Latéral'
  }
  return spins[spin] || spin
}

const getShotSpeedLabel = (speed) => {
  const speeds = {
    'SLOW': '🐢 Lent',
    'MEDIUM': '🚶 Moyen',
    'FAST': '🏃 Rapide'
  }
  return speeds[speed] || speed
}

// Handle keyboard shortcuts
const handleKeyDown = (event) => {
  if (event.key === 'Delete' && selectedShotIndex.value !== null) {
    removeShot(selectedShotIndex.value)
  }
  if (event.key === 'Escape') {
    selectedShotIndex.value = null
    showManualForm.value = false
  }
}

// Watchers
watch(() => props.shots, () => {
  renderShots()
}, { deep: true })

// Lifecycle
onMounted(() => {
  initCanvas()
  document.addEventListener('keydown', handleKeyDown)
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (stage) {
      const newWidth = canvasContainer.value.offsetWidth
      stage.width(newWidth)
      drawTable()
      renderShots()
      stage.draw()
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  if (stage) {
    stage.destroy()
  }
})
</script>

<style scoped>
/* Canvas cursor styles */
canvas {
  cursor: crosshair;
}

/* Scrollbar styling for shot list */
.max-h-96::-webkit-scrollbar {
  width: 4px;
}

.max-h-96::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.max-h-96::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.max-h-96::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>