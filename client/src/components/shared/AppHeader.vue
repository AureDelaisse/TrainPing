<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center h-14">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <div class="w-7 h-7 bg-table-green-600 rounded-md flex items-center justify-center">
            <span class="text-white font-bold text-sm">TT</span>
          </div>
          <span class="text-lg font-semibold text-gray-900">Tennis Table</span>
        </router-link>

        <!-- Navigation -->
        <nav class="hidden md:flex space-x-1">
          <router-link 
            to="/" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.name === 'home' }"
          >
            <HomeIcon class="w-4 h-4" />
            Accueil
          </router-link>
          
          <router-link 
            to="/exercises" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.path.startsWith('/exercises') }"
          >
            <PlayIcon class="w-4 h-4" />
            Exercices
          </router-link>
          
          <router-link 
            to="/sessions" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.path.startsWith('/sessions') }"
          >
            <CalendarIcon class="w-4 h-4" />
            Sessions
          </router-link>
        </nav>

        <!-- Mobile menu button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          <Bars3Icon v-if="!mobileMenuOpen" class="h-5 w-5" />
          <XMarkIcon v-else class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 bg-white">
      <div class="px-4 py-2 space-y-1">
        <router-link 
          to="/" 
          class="mobile-nav-link"
          @click="mobileMenuOpen = false"
        >
          <HomeIcon class="w-4 h-4" />
          Accueil
        </router-link>
        
        <router-link 
          to="/exercises" 
          class="mobile-nav-link"
          @click="mobileMenuOpen = false"
        >
          <PlayIcon class="w-4 h-4" />
          Exercices
        </router-link>
        
        <router-link 
          to="/sessions" 
          class="mobile-nav-link"
          @click="mobileMenuOpen = false"
        >
          <CalendarIcon class="w-4 h-4" />
          Sessions
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { 
  HomeIcon, 
  PlayIcon, 
  CalendarIcon, 
  Bars3Icon, 
  XMarkIcon 
} from '@heroicons/vue/24/outline'

const mobileMenuOpen = ref(false)
</script>

<style scoped>
.nav-link {
  @apply flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors;
}

.nav-link-active {
  @apply text-table-green-700 bg-table-green-50;
}

.mobile-nav-link {
  @apply flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors;
}
</style>